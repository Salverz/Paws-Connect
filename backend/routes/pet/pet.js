const db = require("../../helper_files/database");
const router = require('express').Router();

// Router files
const profileRoute = require('./profile/profile');

// Routers
router.use('/profile', profileRoute);

// Create a new pet
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
        	"accountCreated": true,
        	"response": "Pet profile created successfully"
    	});
    	return;
    }

    // Pet profile was not inserted into the table
    res.json({
    	"accountCreated": false,
      	"response": "Pet profile creation failure: Pet already exists"
    });

});

// Remove a pet
router.delete("/remove", async (req, res) => {
    const petId = req.body.petId;

    // Check if the pet to delete exists
    let sql = `SELECT COUNT(*) "exists"
                FROM pet_profile
                WHERE pet_id = ?`;
    let rows = await db.executeSQL(sql, [petId]);

	// The pet was not added
    if (rows[0].exists == 0) {
      	res.json ({
        	"message": "There is no pet with matching Pet ID"
      	});
      	return;
    }

    // Delete the pet
    sql = `DELETE FROM pet_profile
           WHERE pet_id = ?`;
    await db.executeSQL(sqlDelete, [petId]);
    return res.json({
      	"message": "Pet profile deleted sucessfully"
    });

});

module.exports = router;
