const db = require("../../helper_files/database");
const router = require("express").Router();

// Router files
const profileRoute = require('./profile/profile');

// Routers
router.use('/profile', profileRoute);

// Authenticate a user
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Find a user with the entered username and password
    let sql = `
    SELECT *
    FROM user_account
    WHERE username=? AND password=?
    `;
    
    // Run an SQL query to check whether the user exists
    let rows = await db.executeSQL(sql, [username, password]);
  
    console.log(rows);
    
    if (rows.length == 0) {
      res.json({
        "login": false,
        "message": "Account not found"
      });
      return;
    }
  
    res.json({
      "login": true,
      "message": "Logged in!",
      "userId": rows[0].user_id
    });
});
  
  
// Add a new user account to the database
router.post('/create', async (req, res) => {
  	const email = req.body.email; 
    const username = req.body.username;
    const password = req.body.password;
	const passwordConfirm = req.body.passwordConfirm;

	// Confirm that the entered passwords match
	if (password !== passwordConfirm) {
		console.log(`${password} does not match ${passwordConfirm}`);
		res.json({
			"accountCreated": false,
			"message": "The entered passwords do not match"
		});
		return;
	}

	// Run SQL to check if an account exists already
    let sql = `
    SELECT COUNT(*) "exists"
    FROM user_account
    WHERE username=? OR email=?
    `;
    let rows = await db.executeSQL(sql, [username, email]);
    console.log(rows);
  
    if (rows[0].exists > 0) {
		res.json({
			"accountCreated": false,
			"message": "You already have an account"
		});
		return;
	}
	
	// Run SQL to add a new account
  	sql = `
    INSERT INTO user_account
    (username, password, email, is_admin)
    VALUES
    (?, ?, ?, false)
    `;
  	rows = await db.executeSQL(sql, [username, password, email]);
  	console.log(rows);
  
	// Account was inserted into table successfully
	if (rows.affectedRows > 0)
	{
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

// Retrieve a user's profile data
router.get("/info/:username", async (req, res) => {
    const username = req.params.username;

    // Run an SQL query to get profile data of the user
    const sql = `
    SELECT p.display_name, p.profile_picture, p.location, p.preferred_language, DATE_FORMAT(p.birth_date, "%Y-%m-%d") "birth_date"
    FROM user_profile p
    JOIN user_account a ON (p.user_id = a.user_id)
    WHERE a.username=?
    `;
    const rows = await db.executeSQL(sql, [username]);

    console.log(rows);
    // Check that the user exists
    if (rows.length == 0) { 
      res.json({message: "User not found"});
      return;
    }

    // Send the user's profile data back to the frontend
    res.json({
      "displayName": rows[0].display_name,
      "profilePicture": rows[0].profile_picture,
      "location": rows[0].location,
      "preferredLanguage": rows[0].preferred_language,
      "birthDate": rows[0].birth_date
    });
});
  
// Edit the user's profile with their input information
router.put("/edit", async (req, res) => {
    const username = req.body.username;
    const displayName = req.body.displayName;
    const profilePicture = req.body.profilePicture;
    const location = req.body.location;
    const preferredLanguage = req.body.preferredLanguage;
    const birth_date = req.body.birthDate;
    console.log(birth_date);
  
    // Get the user's user_id
    let sql = `
    SELECT user_id
    FROM user_account
    WHERE username=?
    `;
    let rows = await db.executeSQL(sql, [username]);

    if (rows.length == 0) {
      res.json({
        "success": false
      })
      return;
    }

    const user_id = rows[0].user_id;

    // Create an SQL query to update the user's information in the database. Embed each of the parameters you got from the frontend
    sql = `
    UPDATE user_profile
    SET display_name=?, profile_picture=?, location=?, preferred_language=?
    WHERE user_id=?`;
    rows = await db.executeSQL(sql, [displayName, profilePicture, location, preferredLanguage, user_id]);
    console.log(rows);
  
    // 4.Check the rows variable to confirm that the profile was updated successfully
    // 5. Return the response to the user (the profile was updated successfully or not)
    res.json({
      "success": rows.affectedRows > 0
    });
});

module.exports = router;