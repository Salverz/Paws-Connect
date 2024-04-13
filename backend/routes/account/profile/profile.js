const db = require("../../../helper_files/database");
const router = require("express").Router();


async function fetchZipcodeAndUpdate(zipcode, userId) {
	const apiKey = 'e700389f30b100907f2332b17bfea4c9';
	const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},us&appid=${apiKey}`;
	
	console.log(url);
	try {
	  const reply = await fetch(url);
	  const data = await reply.json();
	  console.log(data);
	  console.log(data.message);
	  if (!data.message) {
		const latitude = data.lat;
		const longitude = data.lon;
		
		console.log(latitude);
		console.log(longitude);

		let sql = `
		INSERT INTO location_lat_long (user_id, latitude, longitude)
		VALUES (?, ?, ?)
		ON DUPLICATE KEY UPDATE
		latitude = VALUES(latitude),
		longitude = VALUES(longitude)`;
  
		const params = [userId, latitude, longitude];
		await db.executeSQL(sql, params);
		
		return {latitude, longitude};
	  }
	} catch (ERROR) {
	  console.error("Coordinates not found for location", ERROR);
	};
	return null;
}


// Create a user profile
router.post("/create", async (req, res) => {
	const { username, displayName, profilePicture, birthDate, zipcode, language } = req.body;
  
	try {
		if (!zipcode) {
			return res.status(400).json({
				success: false,
				message: "No zipcode provided. Please enter a zipcode to complete profile creation."
			});
		}
		const user = await db.executeSQL(`SELECT user_id FROM user_account WHERE username = ?`, [username]);
		if (user.length > 0) {
			const { latitude, longitude } = await fetchZipcodeAndUpdate(zipcode, user[0].user_id);
			console.log("zipcode updated with latitude:", latitude, "and longitude:", longitude);

			res.redirect("http://localhost:5173/feed");
		} else {
			res.status(404).send("User not found for the provided username.");
		}
	  // Insert user profile data
	  const result = await db.executeSQL(`
		INSERT INTO user_profile
		  (user_id, birth_date, display_name, profile_picture, zipcode, preferred_language)
		SELECT user_id, ?, ?, ?, ?, ?
		FROM user_account
		WHERE username = ?`,
		[birthDate, displayName, profilePicture, zipcode, language, username]
	  );
	  
	  console.log(result);
	  
	} catch (error) {
	  console.error("Error creating user profile:", error);
	  res.status(500).send("Failed to create user profile.");
	}
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
