const db = require("../../../helper_files/database");
const router = require("express").Router();

router.get('/:petName', async (req, res) => {
    const petName = req.params.petName;

    const sql =
    `
    SELECT name, profile_picture, species, breed, color, DATE_FORMAT(birth_date, "%Y-%m-%d") "birth_date"
    FROM pet_profile
    WHERE name=?
    `;

    const rows = await db.executeSQL(sql, [petName]);
    console.log(rows);

    res.json({
        "name": rows[0].name,
        "profilePicture": rows[0].profile_picture,
        "species": rows[0].species,
        "breed": rows[0].breed,
        "color": rows[0].color,
        "birthDate": rows[0].birth_date,
    });
});

module.exports = router;