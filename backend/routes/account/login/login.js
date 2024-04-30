const db = require("../../../helper_files/database");
const router = require("express").Router();

const session = require("express-session");

const googleClientIdclientId = "";
const googleClientSecret = "";

router.use(session({
	resave: false,
	saveUninitialized: true,
	secret: "SECRET:"
}));

const passport = require("passport");
let userProfile;

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});

router.get("/success", (req, res) => res.send(userProfile));
router.get("/error", (req, res) => res.send("error logging in"));

const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
passport.use(new googleStrategy({
		clientID: googleClientId,
		clientSecret: googleClientSecret,
		callbackURL: "http://localhost:3000/account/login/google/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		userProfile = profile;
		return done(null, userProfile);
	}
));


router.get('/google',
	passport.authenticate("google", { scope: ["profile", "email"] }));

router.get('/google/callback',
	passport.authenticate("google", { failureRedirect: '/error' }),
	function(req, res) {
		res.redirect("/account/login/success");
});

module.exports = router;
