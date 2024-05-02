// Imports
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const jwt = require('./helper_files/jwt');
// Session stuff
const session = require('express-session');
const passport = require("passport");
const localStrategy = require('passport-local');

// Express setup ----------------------------------------------------
const app = express();
const port = 3000;
app.use(cors({origin: 'http://localhost:5173', credentials: true })); // This should be the url for your front end server (the URL you go to to see the website)

const pool = dbConnection();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('trust proxy', 1);

// Sessions -----------------------------------
app.use(session({
  secret: "EpicKey12jkldakajuiowncx",
  resave: false,
  saveUninitialized: false,
  cookie: {
	  secure: false,
	  maxAge: 60000 * 60,
	  httpOnly: true
  },
}));

// Google authentication --------------------------
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

let userProfile;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});

app.get("/success", (req, res) => res.send(userProfile));
app.get("/error", (req, res) => res.send("error logging in"));

const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
passport.use(new googleStrategy({
		clientID: googleClientId,
		clientSecret: googleClientSecret,
		callbackURL: "http://localhost:3000/google/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		userProfile = profile;
		return done(null, userProfile);
	}
));


app.get('/google',
	passport.authenticate("google", { scope: ["profile", "email"] }));

app.get('/google/callback',
	passport.authenticate("google", { failureRedirect: '/error' }),
	function(req, res) {
		res.redirect("/success");
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// TYPE "node index.js" TO START THE BACKEND SERVER | YOU MUST RESTART THE SERVER WHEN YOU MAKE CHANGES //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// Define routes

// app.get is a GET method. This means when the front end calls "/test", it is
// REQUESTING DATA FROM THE BACKEND
app.get('/', async (req, res) => {
  // Even more Session stuff
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;

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


const accountRoute = require('./routes/account/account')
const petRoute = require('./routes/pet/pet')
const postRoute = require('./routes/post/post')
const searchRoute = require('./routes/search/search');

// app.use(authenticator);
app.use('/account', accountRoute)
app.use('/pet', petRoute)
app.use('/post', postRoute)
app.use('/search', searchRoute)

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
