const db = require("../../../helper_files/database");
const router = require("express").Router();

async function fetchLocationAndUpdate(location, userId) {
	const apiKey = 'e700389f30b100907f2332b17bfea4c9';
	const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`;
	try {
	  const reply = await fetch(url);
	  const data = await reply.json();
	  if (data.length > 0) {
		const latitude = data[0].lat;
		const longitude = data[0].lon;
  
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
	const { username, displayName, profilePicture, birthDate, location, language } = req.body;
  
	try {
	  if (!location) {
		return res.status(400).json({
		  success: false,
		  message: "No location provided. Please enter a location to complete profile creation."
		});
	  }
  
	  // Insert user profile data
	  const result = await db.executeSQL(`
		INSERT INTO user_profile
		  (user_id, birth_date, display_name, profile_picture, location, preferred_language)
		SELECT user_id, ?, ?, ?, ?, ?
		FROM user_account
		WHERE username = ?`,
		[birthDate, displayName, profilePicture, location, language, username]
	  );
  
	  const user = await db.executeSQL(`SELECT user_id FROM user_account WHERE username = ?`, [username]);
	  if (user.length > 0) {
		const { latitude, longitude } = await fetchLocationAndUpdate(location, user[0].user_id);
		console.log("Location updated with latitude:", latitude, "and longitude:", longitude);

		res.redirect("http://localhost:5173/feed");
	  } else {
		res.status(404).send("User not found for the provided username.");
	  }
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
