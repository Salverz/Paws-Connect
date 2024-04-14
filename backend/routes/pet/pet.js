const db = require("../../helper_files/database");
const router = require('express').Router();

// Router files
const profileRoute = require('./profile/profile');

// Routers
router.use('/profile', profileRoute);

// USE "db.executeSQL()" TO RUN SQL
// Create a new pet
// (accessed at [POST] http://localhost:3000/pet/create)
router.post("/create", async (req, res) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const profilePicture = req.body.profilePicture;
  const species = req.body.species;
  const breed = req.body.breed;
  const color = req.body.color;
  const birthDate = req.body.birthDate;

  //check if there is a user that has the id that was provided
  let sql = `SELECT COUNT(*) "exists" 
              FROM user_account 
              WHERE user_id=?`;
  //if there is not then give a error that says the id does not exist 
  let rows = await db.executeSQL(sql, [userId]);
  console.log(rows);
  if (rows[0].exists == 0) {
    res.json({
      "created": false,
      "message": "There is no account with that User ID"
    });
  return;
  }
  //add pet into database
  sql = `INSERT INTO pet_profile
          (owner_user_id, name, profile_picture, species, breed, color, birth_date)
          VALUES (?, ?, ?, ?, ?, ?, ?)`;
  rows = await db.executeSQL(sql, [userId, name, profilePicture, species, breed, color, birthDate]);
  console.log(rows);

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
// (accessed at [DELETE] http://localhost:3000/pet/remove)
router.delete("/remove", async (req, res) => {
    const petId = req.body.petId;
	  console.log(`removing pet ${petId}`);

    // Check if the pet to delete exists
    let sql = `SELECT COUNT(*) "exists"
                FROM pet_profile
                WHERE pet_id = ?`;
    let rows = await db.executeSQL(sql, [petId]);

    //gives error
    if (rows[0].exists == 0) {
      res.json ({
			  "deleted": false,
        "message": "There is no pet with matching Pet ID"
      });
      return;
    }

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
router.get("/pets/:userId", async (req, res) => {
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
			pet.owner_user_id=?

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
			transfer.new_owner=?
	`;
	const rows = await db.executeSQL(sql, [req.params.userId, req.params.userId]);
	res.send(rows);
});


// http://localhost:3000/pet/transfer 
router.put("/transfer", async (req, res) => {
    const petId = req.body.petId;
    const newOwnerId = req.body.newOwnerId;
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
      rows = await db.executeSQL(sql, [newOwnerId, petId]);
      console.log(rows);
    }

    let sqlDelete = `DELETE FROM pet_transfer_request
                      WHERE pet_id=?`;
	await db.executeSQL(sqlDelete, [petId]);
    res.json ({
      "success": true
    })


});

//http://localhost:3000/pet/createTransferRequest
router.post("/createTransferRequest", async (req, res) => {
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

module.exports = router;
