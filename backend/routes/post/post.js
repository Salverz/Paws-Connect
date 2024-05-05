const db = require("../../helper_files/database");
const jwt = require("../../helper_files/jwt");
const { checkAuthenticated } = require("../../helper_files/jwt");
const router = require("express").Router();
require('dotenv').config();
const env = process.env;

// Create a new post
const TextTranslationClient = require("@azure-rest/ai-translation-text").default

const apiKey = env.TRANSLATION_API_KEY; //change into a ENVIRONMENTAL KEY 
const endpoint = env.TRANSLATION_ENDPOINT;
const region = env.TRANSLATION_REGION;

const translateClient = new TextTranslationClient(endpoint, { key: apiKey, region });

// Helper function to translate text
async function translatePostText(text, targetLanguage, postLanguage) {
    const response = await translateClient.path("/translate").post({
        queryParameters: {to: targetLanguage, from : postLanguage},
        body: [{ text: text }]
    });
    if (response.status != 200) {
        throw new Error(`Translation service returned status code ${response.status}`);
    }
    return response.body[0].translations[0].text;
}

// Create a new post
router.post("/create", checkAuthenticated, async (req, res) => {
  const { text_content, post_photo_link, visibility, post_language, petsToTag } = req.body;

  try {
    const userProfile = await db.executeSQL(`
      SELECT a.username, p.profile_picture
      FROM user_profile p
      JOIN user_account a ON (a.user_id = p.user_id)
      WHERE a.user_id = ?
    `, [req.userId]);

    if (userProfile.length === 0) {
      return res.status(404).json({ success: false, message: "User profile not found" });
    }

    const poster_username = userProfile[0].username;
    const poster_profile_picture = userProfile[0].profile_picture;

    const postResult = await db.executeSQL(`
      INSERT INTO post (poster_user_id, text_content, visibility, post_language)
      VALUES (?, ?, ?, ?)
    `, [req.userId, text_content, visibility, post_language]);

    const postId = postResult.insertId;

    if (post_photo_link) {
      await db.executeSQL(`
        INSERT INTO post_photo (attached_to_post_id, photo_link)
        VALUES (?, ?)
      `, [postId, post_photo_link]);
    }

    // Tagged friends and pets logic goes here if needed
        // Insert tagged friends
    // if (taggedFriends && taggedFriends.length) {
    //   for (const friendId of taggedFriends) {
    //     await db.executeSQL(`
    //       INSERT INTO tagged_friend (tagged_post_id, tagged_friend_user_id)
    //       VALUES (?, ?)
    //     `, [postId, friendId]);
    //   }
    // }

	// Insert tagged pets
	 for (let i = 0; i < petsToTag.length; i++) {
	 await db.executeSQL(`
	   INSERT INTO tagged_pet (tagged_post_id, tagged_pet_id)
	   VALUES (?, ?)
	 `, [postId, petsToTag[i]]);
   }

	// Constructing the new post object
    const newPost = {
      post_id: postId,
      poster_username: poster_username,
      poster_profile_picture: poster_profile_picture,
      text_content: text_content,
      visibility: visibility,
      created_at: new Date().toISOString(), // Adjust according to your timezone
      post_language: post_language,
      post_photo_link: post_photo_link || '',
      likes: 0 // Assuming new posts start with zero likes
    };

    res.json({ success: true, message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: 'An error occurred while creating the post' });
  }
});

router.get("/get", checkAuthenticated, async (req, res) => {
	const userID = req.userId;

	const result = await db.executeSQL(`
		SELECT language.language_code, language.language
		FROM user_profile
		JOIN language ON (user_profile.preferred_language = language.language)
		WHERE user_id=?
	`, [userID]);

	const userPreferredLanguage = result[0].language_code;
	console.log(userPreferredLanguage);

	try {

    // const userPreferredLanguage = userResult[0].preferred_language;
    const posts = await db.executeSQL(`
		SELECT
			p.post_id,
			p.poster_user_id,
			ua.username "poster_username",
			up.profile_picture "poster_profile_picture",
			p.text_content,
			p.visibility,
			p.created_at,
			p.post_language, 
			l.language_code,
			? AS "preferred_language",
			pp.photo_link "post_photo_link",
			(
				SELECT
					COUNT(*)
				FROM
					post_like
				WHERE
					liked_post_id = p.post_id
			) AS likes
		FROM
			post p
		JOIN
			user_account ua ON p.poster_user_id = ua.user_id
		JOIN
			user_profile up ON ua.user_id = up.user_id
		JOIN
			language l ON p.post_language = l.language
		LEFT JOIN
			post_photo pp ON p.post_id = pp.attached_to_post_id
		WHERE
			p.visibility = 'public'
				OR
			p.poster_user_id = ?
				OR (
					p.visibility = 'private'
						AND
					p.poster_user_id IN (
						SELECT
							user_2_id
						FROM
							connection
						WHERE
							user_1_id = ?
						
						UNION
						
						SELECT
							user_1_id
						FROM
							connection
						WHERE
							user_2_id = ?
					)
				)
		ORDER BY
			p.created_at DESC
		`, [result[0].language, userID, userID, userID]);
  const translatedPosts = await Promise.all(posts.map(async (post) => {
	  post.translated = false;
  
    if (post.language_code != userPreferredLanguage) {
        post.translated_text = await translatePostText(post.text_content, userPreferredLanguage, post.language_code);
        post.translated_from = post.language_code; // Indicate that this post has been translated

    }else{
        post.translated_from = null;
    }
    return post;
  }));
	  
	  const tags = await db.executeSQL(`
			SELECT *
			FROM tagged_pet tag
			JOIN pet_profile pet ON (tag.tagged_pet_id = pet.pet_id);
		`)

    res.json({ success: true, posts: posts, tags: tags });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ success: false, message: 'An error occurred while retrieving posts' });
  }
});


router.get("/get/petProfile", checkAuthenticated, async (req, res) => {
    const petId = req.petId; // Pet ID obtained from the request parameter or session
	const userId = req.userId;
    try {
        // Fetch the owner of the pet and their friends
        const ownerInfo = await db.executeSQL(`
            SELECT owner_user_id
            FROM pet_profile
            WHERE pet_id = ?
        `, [petId]);
  
        if (ownerInfo.length === 0) {
            res.status(404).json({
                "success": false,
                "message": "Pet not found"
            });
            return;
        }
  
        const ownerId = ownerInfo[0].owner_user_id;
  
        // Determine if the viewer is a friend of the owner
        const isFriend = await db.executeSQL(`
            SELECT COUNT(*) AS friendCount
            FROM connection
            WHERE (user_1_id = ? AND user_2_id = ?) OR (user_1_id = ? AND user_2_id = ?)
        `, [req.userId, ownerId, ownerId, req.userId]);

        // Build visibility condition based on friendship
        let visibilityCondition = isFriend[0].friendCount > 0 ? "(p.visibility = 'friend' OR p.visibility = 'public')" : "p.visibility = 'public'";

        // Fetch posts related to the pet by owner's posts or where the pet is tagged
        const posts = await db.executeSQL(`
            SELECT DISTINCT
                p.post_id,
                p.text_content,
                p.visibility,
                p.created_at,
                ua.username AS poster_username,
                up.profile_picture AS poster_profile_picture,
                (
                    SELECT COUNT(*) FROM post_like WHERE liked_post_id = p.post_id
                ) AS likes,
                (
                    SELECT COUNT(*) FROM comment WHERE commented_post_id = p.post_id
                ) AS comments
            FROM
                post p
            JOIN
                user_account ua ON p.poster_user_id = ua.user_id
            JOIN
                user_profile up ON ua.user_id = up.user_id
            LEFT JOIN
                tagged_pet tp ON tp.tagged_post_id = p.post_id
            WHERE
                (p.poster_user_id = ? AND tp.tagged_pet_id = ?) OR
                (tp.tagged_pet_id = ? AND ${visibilityCondition})
            ORDER BY
                p.created_at DESC
        `, [ownerId, petId, petId]);

        res.json({
            "success": true,
            "posts": posts
        });
    } catch (error) {
        console.error("Error retrieving feed for pet:", error);
        res.status(500).json({
            "success": false,
            "message": "An error occurred while retrieving the feed"
        });
    }
});

router.get("/get/userProfile", async (req, res) => {
    const profileUserId = req.params.userId; // The ID of the user whose profile is being viewed
    const viewingUserId = req.userId; // ID of the user who is viewing the profile, extracted from session or token

    try {
        // Check if the viewing user is a friend of the profile user
        const isFriend = await db.executeSQL(`
            SELECT COUNT(*) AS isFriend
            FROM connection
            WHERE (user_1_id = ? AND user_2_id = ?) OR (user_1_id = ? AND user_2_id = ?)
        `, [viewingUserId, profileUserId, profileUserId, viewingUserId]);

        let visibilityCondition = "p.visibility = 'public'";
        if (isFriend[0].isFriend > 0 || viewingUserId === profileUserId) {
            visibilityCondition = "(p.visibility IN ('public', 'friend') OR p.poster_user_id = ?)";
        }

        // Fetch posts according to the visibility rules and order by creation date descending
        const posts = await db.executeSQL(`
            SELECT
                p.post_id,
                p.text_content,
                p.visibility,
                p.created_at,
                ua.username AS poster_username,
				lan.language_code,
                up.profile_picture AS poster_profile_picture,
                (
                    SELECT COUNT(*) FROM post_like WHERE liked_post_id = p.post_id
                ) AS likes,
                (
                    SELECT COUNT(*) FROM comment WHERE commented_post_id = p.post_id
                ) AS comments
            FROM
                post p
            JOIN
                user_account ua ON p.poster_user_id = ua.user_id
            JOIN
                user_profile up ON ua.user_id = up.user_id
			JOIN 
				language lan ON u                                                                                                                                                                                 p.preferred_language = lan.language
            WHERE
                p.poster_user_id = ? AND ${visibilityCondition}
            ORDER BY
                p.created_at DESC  // Orders the posts by date from newest to oldest
        `, [profileUserId, profileUserId]); // Ensure you pass profileUserId twice if needed
		const translatedPosts = await Promise.all(posts.map(async (post) => {
			post.translated = false;
		
		  if (post.language_code != userPreferredLanguage) {
			  post.translated_text = await translatePostText(post.text_content, userPreferredLanguage, post.language_code);
			  post.translated_from = post.language_code; // Indicate that this post has been translated
	  
		  }else{
			  post.translated_from = null;
		  }
		  return post;
		}));
        res.json({
            success: true,
            posts: posts
        });
    } catch (error) {
        console.error("Error retrieving user and friends' posts:", error);
        res.status(500).json({ success: false, message: 'An error occurred while retrieving posts' });
    }
});
module.exports = router;
