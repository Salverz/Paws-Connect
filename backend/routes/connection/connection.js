const db = require("../../helper_files/database");
const { checkAuthenticated } = require("../../helper_files/jwt");
const router = require('express').Router();

// Get a list of all a user's friends
router.get('/', checkAuthenticated, getFriends);

// Remove a connection
router.delete('/', checkAuthenticated, removeConnection);

// Create a connection request
router.post('/request/create', createConnectionRequest);

// Respond to a connection request
router.post('/request/respond');

// Cancel a connection request
router.delete('/request');

async function getFriends(req, res) {
	const friends = await db.executeSQL(`
		SELECT
			user_profile.birth_date,
			user_profile.display_name,
			user_profile.profile_picture,
			user_profile.zip,
			user_profile.preferred_language
		FROM
		(
			SELECT
				user_1_id,
				user_2_id
			FROM
				connection
			WHERE
				user_1_id = 1
					OR
				user_2_id = 1
		) AS connections
		JOIN
			user_profile
		ON
			(user_profile.user_id = user_1_id OR user_profile.user_id = user_2_id)
		WHERE
			user_profile.user_id != 1`, [req.userId, req.userId]);
	console.log(friends);

	res.json(friends);
}

async function removeConnection(req, res) {
	const response = await db.executeSQL(`
		DELETE FROM
			connection 
		WHERE
			user_1_id = ? OR user_2_id = ?;
		`, [req.userId, req.userId]);

	if (response.affectedRows == 0) {
		res.json({
			"success": "false",
			"message": "Connection not deleted"
		});
		return;
	}
	res.json({
		"success": "true",
		"message": "Successfully created a connection"
	});
}

// Create a connection request
async function createConnectionRequest(req, res) {
	let response;
	try {
		response = await db.executeSQL(`
			INSERT INTO
				connection_request (
					sender_user_id,
					receiver_user_id
				) VALUES (
					1,
					4
				)`, []);
	} catch (error) {
		console.log(error);
		res.json({
			"success": "false",
			"message": "A connection request has already been made to this user"
		});
		return;
	}

	console.log(response);

	if (response.affectedRows == 0) {
		res.json({
			"success": "false",
			"message": "Connection not deleted"
		});
		return;
	}
	res.json({
		"success": "true",
		"message": "Successfully created a connection"
	});
}
module.exports = router;
