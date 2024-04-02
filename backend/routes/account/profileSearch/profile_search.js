const db = require("../../helper_files/database");
const router = require("express").Router();

// Search user profiles
router.get("/search/user", async (req, res) => {
    const {username, displayName, location, language} = req.query;

    let sql = `
    SELECT u.username, up.display_name, up.profile_picture, up.location, up.preferred_language
    FROM user_account u
    LEFT JOIN user_profile up ON u.user_id = up.user_id
    WHERE 1=1
    `;

    const params = [];
    if (username) {
        sql += ` AND u.username LIKE ?`;
        params.push(`%${username}%`);
    }
    if (displayName) {
        sql += ` AND up.display_name LIKE ?`;
        params.push(`%${displayName}%`);
    }
    if (location) {
        sql += ` AND up.location LIKE ?`;
        params.push(`%${location}%`);
    }
    if (language) {
        sql += ` AND up.preferred_language = ?`;
        params.push(language);
    }

    const rows = await db.executeSQL(sql, params);
    console.log(rows);
    res.json(rows);
});