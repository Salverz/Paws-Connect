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
    const owner_user_id = req.body.userId;
    const name = req.body.name;
    const profilePicture = req.body.profilePictureImage;
    const species = req.body.species;
    const breed = req.body.breed;
    const color = req.body.color;
    const birthDate = req.body.birthDate;

    //check if there is a user that has the id that was provided
    let sql = `SELECT COUNT(*) "exists" 
                FROM user_account 
                WHERE user_id=?`;
    //if there is not then give a error that says the id does not exist 
    let rows = await db.executeSQL(sql, [owner_user_id]);
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
    rows = await db.executeSQL(sql, [owner_user_id, name, profilePicture, species, breed, color, birthDate]);
    console.log(rows);

    if (rows.affectedRows > 0) {
      res.json({
        "accountCreated": true,
        "response": "Account created successfully"
      });
      return;
    }
    // Account was not inserted into the table
    res.json({
      "accountCreated": false,
      "response": "Account creation failure: username already exists"
    });

});

// Remove a pet
// (accessed at [DELETE] http://localhost:3000/pet/remove)
router.delete("/remove", async (req, res) => {
    const petID = req.body.petID;
    //check if pet id exists
    let sql = `SELECT COUNT(*) "exists"
                FROM pet_profile
                WHERE pet_id = ?`;
    //gives error
    let rows = await db.executeSQL(sql, [petID]);
    if (rows[0].exists == 0) {
      res.json ({
        "message": "There is no pet with matching Pet ID"
      });
      return;
    } 
    //delete pet profile linked to pet_id
    let sqlDelete = `DELETE FROM pet_profile
                      WHERE pet_id = ?`;
    await db.executeSQL(sqlDelete, [petID]);
    return res.json({
      "message": "Pet profile deleted sucessfully"
    });

});

// Get all the pets that a user has
router.get("/pets/:userId", async (req, res) => {
	const sql =`
	SELECT pet_id "id", name, profile_picture, species, breed, color, birth_date
	FROM pet_profile
	WHERE owner_user_id=?
	`
	const rows = await db.executeSQL(sql, [req.params.userId]);
	res.send(rows);
});


module.exports = router;
