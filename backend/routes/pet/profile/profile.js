const db = require("../../../helper_files/database");
const { checkAuthenticated } = require("../../../helper_files/jwt");
const router = require("express").Router();

//route with pet name for getPetData function in svelte
// router.get('/:petName', async (req, res) => {
//     const petName = req.params.petName;

//     const sql = `SELECT *
//                 FROM pet_profile
//                 WHERE name = ?`;

//     const rows = await db.executeSQL(sql, [petName]);

//     if (rows.length == 0) {
//         res.json({
//             "exist": false
//         });
//         return;
//     }

//     res.json({
//         "exists": true,
//         "petId": rows[0].pet_id,
//         "ownerUserId": rows[0].owner_user_id,
//         "name": rows[0].name,
//         "profilePicture": rows[0].profile_picture,
//         "species": rows[0].species,
//         "breed": rows[0].breed,
//         "color": rows[0].color,
//         "birthDate": rows[0].birth_date,
//     });
// });

router.get('/:petId', async (req, res) => {
    const petId = req.params.petId;

    const sql =
    `
    SELECT
		pet.name,
		pet.profile_picture,
		pet.species,
		pet.bio,
		pet.breed,
		pet.color,
		DATE_FORMAT(pet.birth_date, "%Y-%m-%d") "birth_date",
		user_profile.display_name,
		user_profile.user_id,
		user_profile.profile_picture "owner_profile_picture"
    FROM
		pet_profile pet
	JOIN
		user_profile ON (user_profile.user_id = pet.owner_user_id)
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
		"owner": rows[0].display_name,
        "name": rows[0].name,
		"bio": rows[0].bio,
        "profilePicture": rows[0].profile_picture,
        "species": rows[0].species,
        "breed": rows[0].breed,
        "color": rows[0].color,
        "birthDate": rows[0].birth_date,
		"userId": rows[0].user_id,
		"ownerProfilePicture": rows[0].owner_profile_picture
    });
});


router.patch('/edit', checkAuthenticated, async (req, res) => {
	const petId = req.body.petId;
	const name = req.body.name;
	const profilePictureImage = req.body.profilePictureImage;
	const species = req.body.species;
	const breed = req.body.breed;
	const color = req.body.color;
	const birthDate = req.body.birthDate;
	const bio = req.body.bio;

    const sql = `
	UPDATE
		pet_profile
	SET 
		owner_user_id = owner_user_id,
    	name = ?,
    	profile_picture = ?,
    	species = ?,
    	breed = ?,
    	color = ?,
		bio = ?,
    	birth_date = STR_TO_DATE(?, '%Y-%m-%d')
	WHERE
		pet_id = ?
			AND
		owner_user_id = ?
		
	`;

    const rows = await db.executeSQL(sql, [name, profilePictureImage, species, breed, color, bio, birthDate, petId, req.userId]);
    console.log(rows);

	if (rows.affectedRows == 0) {
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
