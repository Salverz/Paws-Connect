const db = require("../../helper_files/database");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("../../helper_files/jwt.js");

// Router files
const profileRoute = require('./profile/profile');
// const loginRoute = require('./login/login');

// Routers
router.use('/profile', profileRoute);
// router.use('/login', loginRoute);

// Return whether a user's JSON Web Token is valid (signed in)
router.get('/auth', jwt.checkAuthenticated, (req, res) => {
	res.sendStatus(200);
});

// Authenticate a user
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Find a user with the entered username and password
    let sql = `
    SELECT *
    FROM user_account
    WHERE username=?
    `;
    
    // Run an SQL query to check whether the user exists
    let rows = await db.executeSQL(sql, [username]);
  
    console.log(rows);
    
    if (rows.length == 0) {
      res.json({
        "login": false,
        "message": "Account not found"
      });
      return;
    }
    
    const match = await bcrypt.compare(password, rows[0].password);

    if (match) {
      // session stuff
		console.log("set sessionId to " + rows[0].user_id);
      req.session.userId  = rows[0].user_id;
		console.log(req.session);
		const token = jwt.generateToken(rows[0].user_id);
		console.log("token: " + token);

      res.json({
          "login": true,
          "message": "Logged in!",
          "userId": rows[0].user_id,
		  "token": token
      });
    } else {
      res.json({
          "login": false,
          "message": "Incorrect password",
		  "token": null
      });
    }
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
  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);
	// Run SQL to add a new account
    
  	sql = `
    INSERT INTO user_account
    (username, password, email, is_admin)
    VALUES
    (?, ?, ?, false)
    `;
  	rows = await db.executeSQL(sql, [username, hashedPassword, email]);
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

module.exports = router;
