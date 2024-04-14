const db = require("../../../helper_files/database");
const router = require("express").Router();


async function fetchZipcodeAndUpdate(zipcode, userId) {
	const apiKey = 'e700389f30b100907f2332b17bfea4c9';
	const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},us&appid=${apiKey}`;

	console.log(url);
	const reply = await fetch(url);
	const data = await reply.json();
	console.log(data);
	console.log(data.message);
	if (data.message) {
		return null;
	}
	const latitude = data.lat;
	const longitude = data.lon;

	console.log(latitude);
	console.log(longitude);

	const sql = `
		INSERT INTO
			location_lat_long (
				user_id,
				latitude,
				longitude
			)
		VALUES (
			?,
			?,
			?
		);`

	const params = [userId, latitude, longitude];
	const databaseResult = await db.executeSQL(sql, params);
	console.log(databaseResult);

	return {latitude, longitude};
}


// Create a user profile
router.post("/create", async (req, res) => {
	const { username, displayName, profilePicture, birthDate, zip, language } = req.body;
  
	if (!zip) {
		return res.status(400).json({
			success: false,
			message: "No zipcode provided. Please enter a zipcode to complete profile creation."
		});
	}

	const user = await db.executeSQL(`
		SELECT
			user_id
		FROM
			user_account
		WHERE
			username = ?`
		, [username]);
	
	if (user.length == 0) {
		res.status(404).send("User not found for the provided username.");
		return;
	}

	const { latitude, longitude } = await fetchZipcodeAndUpdate(zipcode, user[0].user_id);
	console.log("zipcode updated with latitude:", latitude, "and longitude:", longitude);

	// Insert user profile data
	const result = await db.executeSQL(`
		INSERT INTO
			user_profile (
				user_id,
				birth_date,
				display_name,
				profile_picture,
				zipcode,
				preferred_language
			)
		SELECT
			user_id,
			?,
			?,
			?,
			?,
			?
		FROM
			user_account
		WHERE
			username = ?`,
		[
			birthDate,
			displayName,
			profilePicture,
			zip,
			language,
			username
		]
	);

	console.log(result);

	res.json({
		"profileCreated": true
	});
});

// Get the user's profile data
router.get("/:username", async (req, res) => {
    const username = req.params.username;
    let sql = `
    SELECT a.username, p.display_name, p.profile_picture, p.location, p.preferred_language
    FROM user_account a 
    JOIN user_profile p ON (a.user_id = p.user_id)
    WHERE a.username = ?
    `;
    const rows = await db.executeSQL(sql, username);
    console.log(rows);
    res.json(rows);
});

module.exports = router;
