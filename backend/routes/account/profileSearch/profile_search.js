const db = require("../../helper_files/database");
const router = require("express").Router();

// Search user profiles
router.get("/search/user", async (req, res) => {
    const {username = "", displayName = "", location = "", language = ""} = req.query;

    let sql = `
    SELECT u.username, up.display_name, up.profile_picture, up.location, up.preferred_language
    FROM user_account u
    LEFT JOIN user_profile up ON u.user_id = up.user_id
    WHERE u.username LIKE ?
    AND up.display_name LIKE ?
    AND up.location LIKE ?
    AND up.preferred_language LIKE ?`;

    const params = [`%${username}%`, `%${displayName}%`, `%${location}%`, `%${language}%`];

    try {
        const rows = await db.executeSQL(sql, params);
        console.log(rows);
        res.json(rows);
    } catch (error) {
        console.error("Error executing user profile search:", error);
        res.status(500).send("An error occurred while fetching user profiles.");
    }
});