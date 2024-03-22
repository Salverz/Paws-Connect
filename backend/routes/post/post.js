const db = require("../../helper_files/database");
const router = require("express").Router();

// USE "db.executeSQL()" TO RUN SQL

// Create a new post
// (accessed at [POST] http://localhost:3000/post/create)
router.post("/create", async (req, res) => {
  const { userID, text_content, post_photo_link, visibility, post_language} = req.body;
  console.log(req.body);

  if (!userID) {
    return res.status(400).json({ success: false, message: 'userID is required.' });
  }

  try {
    const userProfile = await db.executeSQL(`
<<<<<<< HEAD
      SELECT a.username, p.profile_picture
      FROM user_profile p
      JOIN user_account a ON (a.user_id = p.user_id)
      WHERE a.user_id = ?
=======
      SELECT display_name, profile_picture
      FROM user_profile
      WHERE user_id = ?
    `, [userID]
    `
      SELECT username
      FROM user_account
      WHERE user_id = ?
>>>>>>> 9b68daabe040beb9da4df9082217865f9c9070ab
    `, [userID]);

    if (userProfile.length === 0) {
      return res.status(404).json({ success: false, message: "User profile not found" });
    }

    const poster_username = userProfile[0].username;
    const poster_profile_picture = userProfile[0].profile_picture;

    const postResult = await db.executeSQL(`
      INSERT INTO post (poster_user_id, text_content, visibility, post_language)
      VALUES (?, ?, ?, ?)
    `, [userID, text_content, visibility, post_language]);

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
    // if (taggedPets && taggedPets.length) {
    //   for (const petId of taggedPets) {
    //     await db.executeSQL(`
    //       INSERT INTO tagged_pet (tagged_post_id, tagged_pet_id)
    //       VALUES (?, ?)
    //     `, [postId, petId]);
    //   }
    // }
    // Constructing the new post object
    const newPost = {
      userID: userID,
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


router.get("/get/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const userResult = await db.executeSQL(`
      SELECT user_id
      FROM user_account
      WHERE username = ?
    `, [username]);

    if (userResult.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userID = userResult[0].user_id;

    const posts = await db.executeSQL(`
      SELECT p.post_id, ua.display_name AS poster_username, up.profile_picture AS poster_profile_picture,
             p.text_content, p.visibility, p.created_at, p.post_language, 
             pp.photo_link AS post_photo_link, 
             (SELECT COUNT(*) FROM post_like WHERE liked_post_id = p.post_id) AS likes
      FROM post p
      JOIN user_account ua ON p.poster_user_id = ua.user_id
      JOIN user_profile up ON ua.user_id = up.user_id
      LEFT JOIN post_photo pp ON p.post_id = pp.attached_to_post_id
      WHERE p.visibility = 'public' OR p.poster_user_id = ?
      ORDER BY p.created_at DESC
    `, [userID]);

    res.json({ success: true, posts: posts });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ success: false, message: 'An error occurred while retrieving posts' });
  }
});
module.exports = router;
