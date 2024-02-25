// Import required modules
const express = require('express');
const cors = require('cors');

// Create an Express application
const app = express();
const port = 3000;
app.use(cors({origin: 'http://localhost:5173'}));





// Define routes
app.get('/test', (req, res) => {

    let number = 5;
    let num2 = 1;
    let sum = number + num2;

  res.json({data: sum});
});

app.get('/account/create', (req, res) => {
    
    req.body.password
    "user1"
    "pass"

    let sql_query = `
    SELECT userId
    FROM users
    WHERE username = "req.body.password" and password = "pass"
    `

    // if (sql_query.length = 1) {
    //     res.json({login: "success"});
    // } else {
    //     res.json({login: "failed"});
    // }
    

  
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
    host: "FILL IN",
    user: "FILL IN",
    password: "FILL IN",
    database: "FILL IN"

  });
  return pool;
}



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});