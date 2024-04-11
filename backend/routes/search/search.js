const db = require("../../helper_files/database");
const router = require("express").Router();
const geolib = require('geolib');

// const searchRoute = require('./routes/search/search');
// app.use('/search', searchRoute);

// Search pet profiles
router.get("/pet", async (req, res) => {
    const {name = "", species = "", breed = "", color = "", ownerUsername = ""} = req.query;

    let sql = `
    SELECT p.name, p.profile_picture, p.species, p.breed, p.color, p.birth_date, u.username AS owner_username
    FROM pet_profile p
    JOIN user_account u ON p.owner_user_id = u.user_id
    WHERE p.name LIKE ?
    AND p.species LIKE ?
    AND p.breed LIKE ?
    AND (p.color LIKE ? OR ? = '')
    AND u.username LIKE ?`;

    const params = [
        `%${name}%`,
        `%${species}%`,
        `%${breed}%`,
        color,
        color, // This allows for a color search if provided, or ignores it if empty
        `%${ownerUsername}%`
    ];

    try {
        const rows = await db.executeSQL(sql, params);
        console.log(rows);
        res.json(rows);
    } catch (error) {
        console.error("Error executing pet profile search:", error);
        res.status(500).send("An error occurred while fetching pet profiles.");
    }
});
// Search user profiles
router.get("/user", async (req, res) => {
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
module.exports = router;