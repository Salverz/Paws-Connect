const db = require("../../../helper_files/database");
const router = require("express").Router();

// Create a user profile
router.post("/create", async (req, res) => {
	const {username, displayName, profilePicture, birthDate, location, language} = req.body;

	const rows = await db.executeSQL(`
		INSERT INTO user_profile
			(user_id, birth_date, display_name, profile_picture, location, preferred_language)
		SELECT user_id, ?, ?, ?, ?, ?
		FROM user_account
		WHERE username = ?
		`, [birthDate, displayName, profilePicture, location, language, username]
	);
	console.log(rows);

	res.redirect("http://localhost:5173/feed");
});	


// Get the user's profile data
router.get("/:username", async (req, res) => {
    const username = req.params.username;
    let sql = `
    SELECT a.username, p.display_name, p.profile_picture, p.location, p.preferred_language
    FROM user_account a 
    JOIN user_profile p ON (a.user_id = p.user_id)
    WHERE a.username = ?
    `;
    const rows = await db.executeSQL(sql, username);
    console.log(rows);
    res.json(rows);
});

module.exports = router;
