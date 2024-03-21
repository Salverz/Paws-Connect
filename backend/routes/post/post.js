const db = require("../../helper_files/database");
const router = require("express").Router();

// USE "db.executeSQL()" TO RUN SQL

// Create a new post
// (accessed at [POST] http://localhost:3000/post/create)
router.post("/create", async (req, res) => {
  const { userID, text_content, post_photo_link, visibility, post_language} = req.body;

  if (!userID) {
    return res.status(400).json({ success: false, message: 'userID is required.' });
  }

  try {
    const userProfile = await db.executeSQL(`
      SELECT username, profile_picture
      FROM user_profile
      WHERE user_id = ?
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

// router.post("/create", async (req, res) => {
//   console.log("Received request to create a new post:", req.body);
//   const { post_id, poster_username, poster_profile_picture, , text_content, visibility, post_language, post_photo_link, likes} = req.body;

//   // Check if userID is provided
//   if (!userID) {
//     console.error("userID is null or undefined.");
//     return res.status(400).json({ success: false, message: 'userID is required.' });
//   }

//   try {
//     // Insert the post into the post table
//     const postResult = await db.executeSQL(`
//       INSERT INTO post (poster_user_id, text_content, visibility)
//       VALUES (?, ?, ?)
//     `, [userID, text_content, visibility]);
//     const postId = postResult.insertId;

//     // If a post image is provided, insert it into the post_photo table
//     if (post_photo_link) {
//       await db.executeSQL(`
//         INSERT INTO post_photo (attached_to_post_id, photo_link)
//         VALUES (?, ?)
//       `, [postId, post_photo_link]);
//     }

//     res.json({ success: true, message: 'Post created successfully', postId: postId });
//   } catch (error) {
//     console.error("Error creating post:", error);
//     res.status(500).json({ success: false, message: 'An error occurred while creating the post' });
//   }
// });


// Get all the posts to display on the user's feed (given the user's username)
// (accessed at http://localhost:3000/post/get/[username])
// router.get("/get/:username", async (req, res) => {
//   console.log(`Fetching posts for user: ${req.params.username}`);
//   const username = req.params.username;

//   try {
//     // Get the user ID for the provided username
//     const userResult = await db.executeSQL(`
//       SELECT user_id
//       FROM user_account
//       WHERE username = ?
//     `, [username]);

//     if (userResult.length === 0) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const userID = userResult[0].user_id;

//     // Retrieve all posts that this user is allowed to see
//     // Initially, this will just retrieve all posts made by the user
//     const posts = await db.executeSQL(`
//       SELECT p.*, pp.photo_link
//       FROM post p
//       LEFT JOIN post_photo pp ON p.post_id = pp.attached_to_post_id
//       WHERE p.poster_user_id = ?
//       ORDER BY p.created_at DESC
//     `, [userID]);

//     res.json({ success: true, posts });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'An error occurred while retrieving posts' });
//   }
// });
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
      SELECT p.post_id, ua.username AS poster_username, up.profile_picture AS poster_profile_picture,
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
