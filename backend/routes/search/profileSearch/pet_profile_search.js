// const db = require("../../helper_files/database");
// const router = require("express").Router();


// // Search pet profiles
// router.get("/search/pet", async (req, res) => {
//     const {name, species, breed, color, ownerUsername} = req.query;

//     let sql = `
//     SELECT p.name, p.profile_picture, p.species, p.breed, p.color, p.birth_date, u.username AS owner_username
//     FROM pet_profile p
//     JOIN user_account u ON p.owner_user_id = u.user_id
//     WHERE 1=1
//     `;

//     const params = [];
//     if (name) {
//         sql += ` AND p.name LIKE ?`;
//         params.push(`%${name}%`);
//     }
//     if (species) {
//         sql += ` AND p.species LIKE ?`;
//         params.push(`%${species}%`);
//     }
//     if (breed) {
//         sql += ` AND p.breed LIKE ?`;
//         params.push(`%${breed}%`);
//     }
//     if (color) {
//         sql += ` AND p.color = ?`;
//         params.push(color);
//     }
//     if (ownerUsername) {
//         sql += ` AND u.username LIKE ?`;
//         params.push(`%${ownerUsername}%`);
//     }

//     const rows = await db.executeSQL(sql, params);
//     console.log(rows);
//     res.json(rows);
// });
const db = require("../../../helper_files/database");
const router = require("express").Router();

// Router files
const searchRoute = require('./search/search');

// Routers
router.use('/search', searchRoute);

// Search pet profiles
router.get("/search/pet", async (req, res) => {
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