const db = require("../../helper_files/database");
const { checkAuthenticated } = require("../../helper_files/jwt");
const router = require('express').Router();

// Router files
const profileRoute = require('./profile/profile');

// Routers
router.use('/profile', profileRoute);

router.post("/create", checkAuthenticated, async (req, res) => {
  const name = req.body.name;
  const profilePicture = req.body.profilePicture;
  const species = req.body.species;
  const breed = req.body.breed;
  const color = req.body.color;
  const birthDate = req.body.birthDate;
  const bio = req.body.bio;

  // Add pet into database
  sql = `INSERT INTO pet_profile
          (owner_user_id, name, profile_picture, species, breed, color, bio, birth_date)
		  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  rows = await db.executeSQL(sql, [req.userId, name, profilePicture, species, breed, color, bio, birthDate]);

  if (rows.affectedRows > 0) {
    res.json({
      "created": true,
      "response": "Pet profile created successfully"
    });
    return;
  }

  // Pet profile was not inserted into the table
  res.json({
    "created": false,
    "response": "Pet profile creation failure: Pet already exists"
  });
});

// Remove a pet
router.delete("/remove", checkAuthenticated, async (req, res) => {
    const petId = req.body.petId;
	  console.log(`removing pet ${petId}`);

    // Delete the pet
    sql = `DELETE FROM pet_profile
           WHERE pet_id = ?`;
    await db.executeSQL(sql, [petId]);
    return res.json({
		"deleted": true,
      	"message": "Pet profile deleted sucessfully"
    });

});

// Get all the pets that a user has
router.get("/pets", checkAuthenticated, async (req, res) => {
	console.log("getting pets for " + req.userId);
	const sql =`
		SELECT
			pet.pet_id AS id,
			pet.name,
			pet.profile_picture,
			pet.species,
			pet.breed,
			pet.color,
			pet.birth_date,
			transfer.new_owner
		FROM
			pet_profile pet
		LEFT JOIN
			pet_transfer_request transfer ON (pet.pet_id = transfer.pet_id)
		WHERE
			transfer.new_owner=?

		UNION

		SELECT
			pet.pet_id AS id,
			pet.name,
			pet.profile_picture,
			pet.species,
			pet.breed,
			pet.color,
			pet.birth_date,
			transfer.new_owner
		FROM
			pet_profile pet
		LEFT JOIN
			pet_transfer_request transfer ON (pet.pet_id = transfer.pet_id)
		WHERE
			pet.owner_user_id=?
	`;
	const rows = await db.executeSQL(sql, [req.userId, req.userId]);
	rows.forEach(row => {
		if (row.new_owner == null) {
			row.pending_transfer = false;
		} else if (row.new_owner != req.userId) {
			row.pending_transfer = true;
		} else {
			row.pending_transfer = false;
		}
	});

	console.log(rows);
	res.send(rows);
});


// Respond to a transfer request
router.put("/transfer", checkAuthenticated, async (req, res) => {
    const petId = req.body.petId;
    const doTransfer = req.body.doTransfer;

    sql = `SELECT COUNT(*) "exists"
            FROM pet_transfer_request
            WHERE pet_id=?`;
    rows = await db.executeSQL(sql ,[petId]);
    if (rows[0].exists == 0) {
      res.json ({
		"success": false,
        "message": "There is no transfer request to match that pet id"
      });
      return;
    }
    
    if (doTransfer) {
      sql = `UPDATE pet_profile
              SET owner_user_id=?
              WHERE pet_id=?`;
      rows = await db.executeSQL(sql, [req.userId, petId]);
      console.log(rows);
    }

    const sqlDelete = `DELETE FROM pet_transfer_request
                      WHERE pet_id=?`;
	await db.executeSQL(sqlDelete, [petId]);
    res.json ({
      "success": true
    })


});

// Create a pet profile transfer request
router.post("/createTransferRequest", checkAuthenticated, async (req, res) => {
    const petId = req.body.petId;
    const newOwnerUsername = req.body.newOwnerUsername;

    //create transfer request
    try {
		sql = `
		INSERT INTO
			pet_transfer_request (
				pet_id,
				new_owner
			)
		VALUES (
			?,
			(
				SELECT
					user_id
				FROM
					user_account
				WHERE
					username=?
			))`;
      rows = await db.executeSQL(sql, [petId, newOwnerUsername]);
      console.log(rows);
    } catch (error) {
		console.log(error);
      res.json ({
        "requestCreated": false,
        "response": "Transfer request already exists or username does not exist"
      });
      return;
    }

    if (rows.affectedRows > 0) {
      res.json({
        "requestCreated": true,
        "response": "Request created successfully"
      });
      return;
    } else {
      res.json({
        "requestCreated": false,
        "response": "Failed to create request"
      });
    }
  
});

// Cancel a transfer request
router.delete("/cancelTransfer", checkAuthenticated, async (req, res) => {
    const petId = req.body.petId;

    const sqlDelete = `DELETE FROM pet_transfer_request
                      WHERE pet_id=?`;
	await db.executeSQL(sqlDelete, [petId]);
    res.json ({
      "success": true
    })
});

module.exports = router;
