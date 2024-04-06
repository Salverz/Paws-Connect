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
    const owner_user_id = req.body.ownerId;
    const petName = req.body.petname;
    const petPFP = req.body.petPFP;
    const species = req.body.species;
    const breed = req.body.breed;
    const color = req.body.color;
    const birthDay = req.body.birthDay;

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
    rows = await db.executeSQL(sql, [owner_user_id, petName, petPFP, species, breed, color, birthDay]);
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

// http://localhost:3000/pet/transfer 
router.put("/transfer", async (req, res) => {
    const petID = req.body.petID;
    const ownerID = req.body.ownerID;
    const new_ownerID = req.body.new_ownerID;

    let sql = `SELECT COUNT(*) "exists"
                FROM pet_profile
                WHERE pet_id=? AND owner_user_id=?`;
    let rows = await db.executeSQL(sql, [petID, ownerID]);
    //checks pet id and owner id is good
    if (rows[0].exists == 0) {
      res.json ({
        "message": "There is no pet or user matching that id"
      });
      return;
    }
    
    sql = `SELECT COUNT(*) "exists"
            FROM user_profile
            WHERE user_id=?`;
    rows = await db.executeSQL(sql, [new_ownerID]);
    if (rows[0].exists == 0) {
      res.json ({
        "message": "There is no user matching that id"
      });
      return;
    }
    
    sql = `UPDATE pet_profile
            SET owner_user_id=?
            WHERE pet_id=?`;
    rows = await db.executeSQL(sql, [new_ownerID, petID]);
    console.log(rows);
    res.json ({
      "success": rows.affectedRows > 0
    })

});

module.exports = router;