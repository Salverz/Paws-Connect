const db = require("../../helper_files/database");
const router = require("express").Router();

// Router files
const profileRoute = require('./profile/profile');

// Routers
router.use('/profile', profileRoute);


// Search pet profiles
router.get("/search/pet", async (req, res) => {
    const {name, species, breed, color, ownerUsername} = req.query;

    let sql = `
    SELECT p.name, p.profile_picture, p.species, p.breed, p.color, p.birth_date, u.username AS owner_username
    FROM pet_profile p
    JOIN user_account u ON p.owner_user_id = u.user_id
    WHERE 1=1
    `;

    const params = [];
    if (name) {
        sql += ` AND p.name LIKE ?`;
        params.push(`%${name}%`);
    }
    if (species) {
        sql += ` AND p.species LIKE ?`;
        params.push(`%${species}%`);
    }
    if (breed) {
        sql += ` AND p.breed LIKE ?`;
        params.push(`%${breed}%`);
    }
    if (color) {
        sql += ` AND p.color = ?`;
        params.push(color);
    }
    if (ownerUsername) {
        sql += ` AND u.username LIKE ?`;
        params.push(`%${ownerUsername}%`);
    }

    const rows = await db.executeSQL(sql, params);
    console.log(rows);
    res.json(rows);
});