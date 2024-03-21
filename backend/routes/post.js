const db = require("../../helper_files/database");
const router = require("express").Router();

// USE "db.executeSQL()" TO RUN SQL

// Create a new post
// (accessed at [POST] http://localhost:3000/post/create)
router.post("/create", async (req, res) => {

});

// Get all the posts to display on the user's feed (given the user's username)
// (accessed at http://localhost:3000/post/get/[username])
router.get("/get/:username", async (req, res) => {
  const username = req.params.username;
});

module.exports = router;