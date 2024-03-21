const express = require("express")
const router = express.Router()

const mysql = require('mysql');
const pool = dbConnection();

router.get('/testing', async (req, res) => {
  res.json({
    "success": true
  }) 
});

router.post('/post/create', async (req, res) => {
    // 1. Grab username and password data using req.body.[PARAMETER]
    let username = req.body.username;
    let password = req.body.password;
    let displayName = req.body.displayName;
    let profilePictureRef = req.body.profilePicture;
    let currentlocation = req.body.location;
    let preferredLanguage = req.body.preferredLanguage;
  
    let sql = `SELECT COUNT(*) "exists"
              FROM user
              WHERE username=?`
    let rows = await executeSQL(sql, [username]);
    console.log(rows);
  
    if (rows[0].exists == 0) {
      // 2. Create an SQL query to add a new account to the database. Embed each of the parameters you got from the frontend
      sql = `INSERT INTO user (username, passcode, displayname, profilePictureRef, currentlocation, preferredLanguage, isAdmin) VALUES (?, ?, ?, ?, ?, ?, false)`;
  
      // 3. Run the SQL query and store result in variable
      rows = await executeSQL(sql, [username, password, displayName, profilePictureRef, currentlocation, preferredLanguage]);
      console.log(rows);
  
      // 4. Check the rows variable to confirm that adding the new account was successful
      // 5. Return the response to the user (the account was created successfully or not)
      // res.json({
      //   "response": "Account Has Been Created"
      // });
      res.redirect("http://localhost:5173/account/edit")
    } else {
      res.json({
        "response": "Account creation failure: username already exists"
      });
    }
});

async function executeSQL(sql, params) {
  return new Promise(function(resolve, reject) {
    pool.query(sql, params, function(err, rows, fields) {
      if (err) throw err;
      resolve(rows);
    });
  });
}


function dbConnection() {
  const pool = mysql.createPool({
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    connectionLimit: 10,
    host: "h2cwrn74535xdazj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "oynqhup71k56jj0y",
    password: "jkv88aqmtzrpzqa3",
    database: "j59qb6u7tk71ja7u"

  });
  return pool;
}


module.exports = router;