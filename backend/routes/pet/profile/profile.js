const db = require("../../../helper_files/database");
const router = require("express").Router();

router.get('/:petId', async (req, res) => {
    const petId = req.params.petId;

    const sql =
    `
    SELECT
		name,
		profile_picture,
		species,
		breed,
		color,
		DATE_FORMAT(birth_date, "%Y-%m-%d") "birth_date"
    FROM
		pet_profile
    WHERE
		pet_id=?
    `;

    const rows = await db.executeSQL(sql, [petId]);
    console.log(rows.length);

	if (rows.length == 0) {
		res.json({
			"exists": false
		});
		return;
	}
    res.json({
		"exists": true,
        "name": rows[0].name,
        "profilePicture": rows[0].profile_picture,
        "species": rows[0].species,
        "breed": rows[0].breed,
        "color": rows[0].color,
        "birthDate": rows[0].birth_date,
    });
});


router.patch('/edit', async (req, res) => {
	const petId = req.body.petId;
	const name = req.body.name;
	const profilePictureImage = req.body.profilePictureImage;
	const species = req.body.species;
	const breed = req.body.breed;
	const color = req.body.color;
	const birthDate = req.body.birthDate;

    const sql = `
	UPDATE
		pet_profile
	SET 
    	name = ?,
    	profile_picture = ?,
    	species = ?,
    	breed = ?,
    	color = ?,
    	birth_date = STR_TO_DATE(?, '%Y-%m-%d')
	WHERE
		pet_id = ?
	`;

    const rows = await db.executeSQL(sql, [name, profilePictureImage, species, breed, color, birthDate, petId]);
    console.log(rows);

	if (rows.length == 0) {
		res.json({
			"updated": false
		});
		return;
	}
    res.json({
		"updated": true
    });
});
module.exports = router;
