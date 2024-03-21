const db = require("../../helper_files/database");
const router = require("express").Router();

// USE "db.executeSQL()" TO RUN SQL

// Create a new post
// (accessed at [POST] http://localhost:3000/post/create)
router.post("/create", async (req, res) => {
  const { userID, postText, postImage, taggedFriends, taggedPets, visibility } = req.body;

  try {
    // Insert the post into the post table
    const postResult = await db.executeSQL(`
      INSERT INTO post (poster_user_id, text_content, visibility)
      VALUES (?, ?, ?)
    `, [userID, postText, visibility]);

    const postId = postResult.insertId;

    // If a post image is provided, insert it into the post_photo table
    if (postImage) {
      await db.executeSQL(`
        INSERT INTO post_photo (attached_to_post_id, photo_link)
        VALUES (?, ?)
      `, [postId, postImage]);
    }

    // Insert tagged friends
    for (const friendId of taggedFriends) {
      await db.executeSQL(`
        INSERT INTO tagged_friend (tagged_post_id, tagged_friend_user_id)
        VALUES (?, ?)
      `, [postId, friendId]);
    }

    // Insert tagged pets
    for (const petId of taggedPets) {
      await db.executeSQL(`
        INSERT INTO tagged_pet (tagged_post_id, tagged_pet_id)
        VALUES (?, ?)
      `, [postId, petId]);
    }

    res.json({ success: true, message: 'Post created successfully', postId: postId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while creating the post' });
  }
});

// Get all the posts to display on the user's feed (given the user's username)
// (accessed at http://localhost:3000/post/get/[username])
router.get("/get/:username", async (req, res) => {
  const username = req.params.username;

  try {
    // Get the user ID for the provided username
    const userResult = await db.executeSQL(`
      SELECT user_id
      FROM user_account
      WHERE username = ?
    `, [username]);

    if (userResult.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userID = userResult[0].user_id;

    // Retrieve all posts that this user is allowed to see
    // Initially, this will just retrieve all posts made by the user
    const posts = await db.executeSQL(`
      SELECT p.*, pp.photo_link
      FROM post p
      LEFT JOIN post_photo pp ON p.post_id = pp.attached_to_post_id
      WHERE p.poster_user_id = ?
      ORDER BY p.created_at DESC
    `, [userID]);

    res.json({ success: true, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while retrieving posts' });
  }
});

module.exports = router;
