const db = require("../../helper_files/database");
const jwt = require("../../helper_files/jwt");
const { checkAuthenticated } = require("../../helper_files/jwt");
const router = require("express").Router();

// Create a new post
const TextTranslationClient = require("@azure-rest/ai-translation-text").default

const apiKey = "8b0eab61f028479c9b5cba0086961032"; //change into a ENVIRONMENTAL KEY 
const endpoint = "https://api.cognitive.microsofttranslator.com/";
const region = "global";

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

router.get("/get", jwt.checkAuthenticated, async (req, res) => {
	console.log("getting session");
	const token = req.headers.authorization.split(' ')[1];
	console.log(token);
	const decoded = jwt.verifyToken(token);
	console.log(decoded);
	const userID = decoded.userId;

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
module.exports = router;
