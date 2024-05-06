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
	let translatedSuccessfully = false
	let response;
	while (!translatedSuccessfully) {
		response = await translateClient.path("/translate").post({
			queryParameters: {to: targetLanguage, from : postLanguage},
			body: [{ text: text }]
		});
		if (response.status != 200) {
			console.log("post translation api call failed. trying again...");
			// throw new Error(`Translation service returned status code ${response.status}`);
			continue;
		}
		translatedSuccessfully = true;
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
			DATE_FORMAT(p.created_at, "%m/%d/%y") "created_at_date",
			DATE_FORMAT(p.created_at, "%h:%i%p") "created_at_time",
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


router.get("/pet", checkAuthenticated, async (req, res) => {
    const petId = req.query.petId; // Pet ID obtained from the request parameter or session
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

         // Check if the viewing user is a friend of the profile user
		 const isFriend = await db.executeSQL(`
			SELECT COUNT(*) AS isFriend
			FROM connection
			WHERE (user_1_id = ? AND user_2_id = ?) OR (user_1_id = ? AND user_2_id = ?)
		`, [userId, ownerId, ownerId, userId]);

		let visibilityCondition = "p.visibility = 'public'";
		if (isFriend[0].isFriend > 0 || userId == ownerId) {
			visibilityCondition = "(p.visibility IN ('public', 'private') OR p.poster_user_id = ?)";
		}


        // Fetch the preferred language of the viewing user
        const viewerLangResult = await db.executeSQL(`
            SELECT up.preferred_language, lan.language_code
            FROM user_profile up
			JOIN language lan ON up.preferred_language = lan.language
            WHERE user_id = ?
        `, [userId]);
        const viewerPreferredLanguage = viewerLangResult[0].language_code;

        // Fetch posts related to the pet by owner's posts or where the pet is tagged
        const posts = await db.executeSQL(`
            SELECT DISTINCT
                p.post_id,
                p.text_content,
                p.visibility,
                p.created_at,
                ua.username AS poster_username,
                up.profile_picture AS poster_profile_picture,
                p.post_language,
				lan.language_code,
				? AS "preferred_language",
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
				language lan ON p.post_language = lan.language
            LEFT JOIN
                tagged_pet tp ON tp.tagged_post_id = p.post_id
            WHERE
                (p.poster_user_id = ? AND tp.tagged_pet_id = ? AND ${visibilityCondition})
            ORDER BY
                p.created_at DESC
        `, [viewerLangResult[0].language, ownerId, petId, petId]);

        // Translate posts if necessary
        const translatedPosts = await Promise.all(posts.map(async (post) => {
            if (post.language_code != viewerPreferredLanguage) {
                post.translated_text = await translatePostText(post.text_content, viewerPreferredLanguage, post.language_code);
                post.translated = true;
                post.translated_from = post.post_language;
            } else {
                post.translated_text = post.text_content;
                post.translated = false;
                post.translated_from = null;
            }
            return post;
        }));

        res.json({
            "success": true,
            "posts": translatedPosts
        });
    } catch (error) {
        console.error("Error retrieving feed for pet:", error);
        res.status(500).json({
            "success": false,
            "message": "An error occurred while retrieving the feed"
        });
    }
});


router.get("/user", checkAuthenticated, async (req, res) => {
    const profileUserId = req.query.profileUserId; // The ID of the user whose profile is being viewed
    const viewingUserId = req.userId; // ID of the user who is viewing the profile, extracted from session or token

    try {
        // Fetch the preferred language of the viewing user
        const viewerLangResult = await db.executeSQL(`
            SELECT preferred_language, lan.language_code
            FROM user_profile
			JOIN language lan ON  user_profile.preferred_language = lan.language
            WHERE user_id = ?
        `, [viewingUserId]);

        if (viewerLangResult.length === 0) {
            return res.status(404).json({ success: false, message: "Viewer profile not found" });
        }

        const userPreferredLanguage = viewerLangResult[0].language_code;

        // Check if the viewing user is a friend of the profile user
        const isFriend = await db.executeSQL(`
            SELECT COUNT(*) AS isFriend
            FROM connection
            WHERE (user_1_id = ? AND user_2_id = ?) OR (user_1_id = ? AND user_2_id = ?)
        `, [viewingUserId, profileUserId, profileUserId, viewingUserId]);

        let visibilityCondition = "p.visibility = 'public'";
        if (isFriend[0].isFriend > 0 || viewingUserId === profileUserId) {
            visibilityCondition = "(p.visibility IN ('public', 'private') OR p.poster_user_id = ?)";
        }

        // Fetch posts according to the visibility rules and order by creation date descending
        const posts = await db.executeSQL(`
            SELECT
                p.post_id,
                p.text_content,
                p.visibility,
                p.created_at,
                ua.username AS poster_username,
                up.profile_picture AS poster_profile_picture,
                p.post_language,
				lan.language_code,
				? AS "preferred_language",
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
				language lan ON p.post_language = lan.language
            WHERE
                p.poster_user_id = ? AND ${visibilityCondition}
            ORDER BY
                p.created_at DESC
        `, [viewerLangResult[0].language, profileUserId, profileUserId]);

        // Translate posts if necessary
        const translatedPosts = await Promise.all(posts.map(async (post) => {
            if (post.language_code !== userPreferredLanguage) {
                post.translated_text = await translatePostText(post.text_content, userPreferredLanguage, post.language_code);
                post.translated = true;
                post.translated_from = post.post_language;
            } else {
                post.translated_text = post.text_content;
                post.translated = false;
                post.translated_from = null;
            }
            return post;
        }));

        res.json({
            success: true,
            posts: translatedPosts
        });
    } catch (error) {
        console.error("Error retrieving user and friends' posts:", error);
        res.status(500).json({ success: false, message: 'An error occurred while retrieving posts' });
    }
});

module.exports = router;
