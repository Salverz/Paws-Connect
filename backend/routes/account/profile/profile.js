const db = require("../../../helper_files/database");
const router = require("express").Router();


async function fetchZipcodeAndUpdate(zipcode, userId) {
	const apiKey = 'e700389f30b100907f2332b17bfea4c9';
	const url = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},us&appid=${apiKey}`;

	const reply = await fetch(url);
	if (reply.message) {
		return null;
	}
	const latitude = reply.lat;
	const longitude = reply.lon;

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
		)
		ON DUPLICATE KEY UPDATE
    		latitude = VALUES(latitude),
    		longitude = VALUES(longitude)
		;`;

	const params = [userId, latitude, longitude];
	
	const databaseResult = await db.executeSQL(sql, params);

	console.log(databaseResult);

	return {latitude, longitude};
}


// Create a user profile
router.post("/create", async (req, res) => {
	const { username, displayName, profilePicture, birthDate, zip, language } = req.body;
  
	if (!zip) {
		return res.json({
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
		res.json({
			"profileCreated": false,
			"message": "invalid username"
		});
		return;
	}

	const locationData = await fetchZipcodeAndUpdate(zip, user[0].user_id);

	if (!locationData) {
		res.json({
			"profileCreated": false,
			"message": "invalid location"
		});
		return;
	}

	// Insert user profile data
	try {
		const result = await db.executeSQL(`
			INSERT INTO
				user_profile (
					user_id,
					birth_date,
					display_name,
					profile_picture,
					zip,
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
	} catch (error) {
		res.json({
			"profileCreated": false,
			"message": "user already has a profile"
		});
		return;
	}

	res.json({
		"profileCreated": true
	});
});

// Get the user's profile data
router.get("/:username", async (req, res) => {
    const username = req.params.username;
    let sql = `
    	SELECT
			a.username,
			p.display_name,
			p.profile_picture,
			p.location,
			p.preferred_language
    	FROM
			user_account a 
    	JOIN
			user_profile p ON (a.user_id = p.user_id)
    	WHERE
			a.username = ?
    `;
    const rows = await db.executeSQL(sql, username);
    console.log(rows);
    res.json(rows);
});

module.exports = router;
