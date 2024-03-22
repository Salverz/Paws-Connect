const db = require("../../../helper_files/database");
const router = require("express").Router();

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