// Import required modules
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

// Create an Express application
const app = express();
const port = 3000;
app.use(cors({origin: 'http://localhost:5173'})); // This should be the url for your front end server (the URL you go to to see the website)

const pool = dbConnection();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Ignore all this ^ (unless you get an error)


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// TYPE "node index.js" TO START THE BACKEND SERVER | YOU MUST RESTART THE SERVER WHEN YOU MAKE CHANGES //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// Define routes

// app.get is a GET method. This means when the front end calls "/test", it is
// REQUESTING DATA FROM THE BACKEND
app.get('/test', async (req, res) => {

  // Create an SQL query
  let sql = `SELECT *
            FROM user
            WHERE ID = 1`;
  
  // Run the SQL query on the database and store result in variable "rows"
  let rows = await executeSQL(sql);

  // The SQL query returns a list of rows. Since we are only expecting one result,
  // we just return the first element in the list because it is our one and only result
  let firstRow = rows[0];

  // We want the "currentlocation" field
  let currentLocationOfUser = firstRow.currentlocation;

  // Send the fetched data back to the front end using json
  res.json({
    databaseResponse: currentLocationOfUser
  });
});

// app.post is a POST method. This means that when the front end calls "login", it is
// SENDING DATA TO THE BACKEND
app.post('/login', async (req, res) => {
  // Whenever the front end sends data in a form, we can get the data that was on the
  // form by using "req.body". On the front end, we had:
  //    <input type="text" id="username" name="username">
  // So on the backend, we know that "username" is the parameter we want
  // So, req.body.username
  let enteredUsername = req.body.username;

  // Create an SQL query and embed "enteredUsername" into the query so that we can
  // use it to search the database
  let sql = `SELECT *
            FROM user
            WHERE username = "${enteredUsername}"`;
  
  // Run the SQL query and store the result in variable "rows"
  let rows = await executeSQL(sql);

  // The SQL query returns a list of rows. Since we are only expecting one result,
  // we just return the first element in the list because it is our one and only result
  let firstRow = rows[0];

  // We want the "displayName" field
  let displayName = firstRow.displayname

  // Send the fetched data back to the front end using json
  res.json({
    userDisplayName: displayName
  })
});


// TODO: Make an /account/create route to get username and password data from front end
// and add it to the database
app.post('/account/create', async (req, res) => {
  // 1. Grab username and password data using req.body.[PARAMETER]
  let username = req.body.username;
  let passcode = req.body.passcode;
  let key = req.body.key;
  console.log(username);
  console.log(passcode);

  let sql = `SELECT COUNT(*) "exists"
            FROM user
            WHERE username=?`
  let rows = await executeSQL(sql, [username]);
  console.log(rows);

  if (rows[0].exists == 0) {
    // 2. Create an SQL query to add a new account to the database. Embed each of the parameters you got from the frontend
    sql = `INSERT INTO user (username, passcode, ID) VALUES (?, ?, ?)`;

    // 3. Run the SQL query and store result in variable
    rows = await executeSQL(sql, [username, passcode, key]);
    console.log(rows);

    // 4. Check the rows variable to confirm that adding the new account was successful
    // 5. Return the response to the user (the account was created successfully or not)
    res.json({
      "response": "Account Has Been Created"
    });
  } else {
    res.json({
      "response": "Account creation failure: username already exists"
    });
  }
});


// TODO: make an /account/info route that will grab all of the profile data of the user.
// This is so we can display on the front end what the current profile looks like before
// the user makes changes to it
app.get("/account/info/:userId", async (req, res) => {
  // See the :userId in the url? This means that the front end can add the userId onto the
  // url, and we can access it with req.params.userId. For example:
  http://localhost:3000/account/info/3 would make req.params.userId == 3

  // 1. Extract the userId from the request
  // let userId =


  // 2. Create an SQL query to get all the profile data of the user by embedding the userId in the query
  // let sql = ``


  // 3. Execute the SQL and store the result in a variable. We should get data for one user, so our result should have just one row.
  // In other words, "rows" should be an array with one element, a json that contains all the user's profile data
  // let rows =


  // 4. Extract the user's profile information from the query result

  
  // 5. Send the user's profile data to the front end
  res.json({
    "displayName": "",
    "profilePictureRef": "",
    "currentLocation": "",
    "preferredLanguage": ""
  });
});


// TODO: Make an /account/edit route so that when the user modifies their profile
// information, we can update the database to reflect the changes
app.post("/account/edit", async (req, res) => {
  // 1. Grab each of the input parameters using req.body.[PARAMETER]
  // let userId =
  // let displayName =
  // let profilePictureRef =
  // let currentLocation = 
  // let preferredLanguage =


  // 2. Create an SQL query to update the user's information in the database. Embed each of the parameters you got from the frontend
  // let rows = ``


  // 3. Run the SQL query and store the result in a variable
  // let rows =


  // 4.Check the rows variable to confirm that the profile was updated successfully


  // 5. Return the response to the user (the profile was updated successfully or not)
  res.json({
    "response": ""
  });
});


// Use this to execute your SQL queries
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


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});