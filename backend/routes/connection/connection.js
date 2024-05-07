const db = require("../../helper_files/database");
const { checkAuthenticated } = require("../../helper_files/jwt");
const router = require('express').Router();
const { getShortestPath } = require("../../helper_files/bfs");

// Get a list of all a user's friends
router.get('/', checkAuthenticated, getFriends);

// Remove a connection
router.delete('/', checkAuthenticated, removeConnection);

// Create a connection request
router.post('/request/create', checkAuthenticated, createConnectionRequest);

// Respond to a connection request
router.post('/request/respond', checkAuthenticated, respondToConnectionRequest);

// Cancel a connection request
router.delete('/request', checkAuthenticated, cancelConnectionRequest);

// Get the shortest connection path between two users
router.get('/path', checkAuthenticated, connectionPath);

async function getFriends(req, res) {
	const friends = await db.executeSQL(`
		SELECT
			user_profile.user_id,
			user_profile.birth_date,
			user_profile.display_name,
			user_profile.profile_picture,
			user_profile.zip,
			user_profile.preferred_language,
			null "sender_user_id",
			null "receiver_user_id"
		FROM (
			SELECT
				user_1_id,
				user_2_id
			FROM
				connection
			WHERE
				user_1_id = ?
					OR
				user_2_id = ?
		) AS connections
		JOIN
			user_profile
		ON
			(user_profile.user_id = user_1_id OR user_profile.user_id = user_2_id)
		WHERE
			user_profile.user_id != ?

		UNION

		SELECT
			user_profile.user_id,
			user_profile.birth_date,
			user_profile.display_name,
			user_profile.profile_picture,
			user_profile.zip,
			user_profile.preferred_language,
			connection_requests.sender_user_id,
			connection_requests.receiver_user_id
		FROM (
			SELECT
				sender_user_id,
				receiver_user_id
			FROM
				connection_request
			WHERE
				sender_user_id = ?
					OR
				receiver_user_id = ?
		) AS connection_requests
		JOIN
			user_profile
		ON
			(user_profile.user_id = sender_user_id OR user_profile.user_id = receiver_user_id)
		WHERE
			user_profile.user_id != ?
		`, [req.userId, req.userId, req.userId, req.userId, req.userId, req.userId]);
	console.log(friends);

	res.json(friends);
}

async function removeConnection(req, res) {
	const response = await db.executeSQL(`
		DELETE FROM
			connection 
		WHERE
			(user_1_id = ? AND user_2_id = ?)
				OR
			(user_2_id = ? AND user_1_id = ?)
		`, [req.userId, req.body.friend, req.userId, req.body.friend]);

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
					?,
					?
				)`, [req.userId, req.body.connectionReceiver]);
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
		"message": "Successfully created a connection request"
	});
}

// The user that made the connection request cancels it
async function cancelConnectionRequest(req, res) {
	let response;
	try {
		response = await db.executeSQL(`
			DELETE FROM
				connection_request
			WHERE
				sender_user_id = ?
					AND
				receiver_user_id = ?
				`, [req.userId, req.body.connectionReceiver]);
	} catch (error) {
		console.log(error);
		res.json({
			"success": "false",
			"message": "There is no connection request pending for this user"
		});
		return;
	}

	console.log(response);

	if (response.affectedRows == 0) {
		res.json({
			"success": "false",
			"message": "The connection request could not be canceled"
		});
		return;
	}
	res.json({
		"success": "true",
		"message": "Connection request canceled"
	});
}

// The receiver accepts or denies a connection request
async function respondToConnectionRequest(req, res) {
	let response = await db.executeSQL(`
			DELETE FROM
				connection_request
			WHERE
				sender_user_id = ?
					AND
				receiver_user_id = ?
				`, [req.body.senderId, req.userId]);
	console.log(response);

	if (!req.body.doAccept) {
		if (response.affectedRows == 0) {
			res.json({
				"success": "false",
				"message": "The connection could not be denied"
			});
			return;
		}

		res.json({
			"success": true,
			"message": "Successfully denied the connection request"
		});
		return;
	}

	response = await db.executeSQL(`
		INSERT INTO
			connection (
				user_1_id,
				user_2_id
			)
		VALUES (
			?,
			?
		)`, [req.body.senderId, req.userId]);
	
	if (response.affectedRows == 0) {
		res.json({
			"success": "false",
			"message": "The connection could not be accepted"
		});
		return;
	}
	res.json({
		"success": "true",
		"message": "Connection request accepted!"
	});
}

async function connectionPath(req, res) {
	const userList = await db.executeSQL(`
		SELECT
			DISTINCT(user_id),
			display_name,
			profile_picture
		FROM
			connection
		JOIN
			user_profile ON (user_1_id = user_profile.user_id OR user_2_id = user_profile.user_id)
		`, []);

	const connections = await db.executeSQL(`
		SELECT
			*
		FROM
			connection
		`, []);

	console.log(connections);
	
	const connectionEdges = [];

	connections.forEach(connection => {
		const edge = [connection.user_1_id, connection.user_2_id];
		connectionEdges.push(edge);
	});

	console.log(connectionEdges);

	const path = getShortestPath(connectionEdges, req.userId, req.query.end);
		
	const connectionPathList = [];

	path.forEach(userId => {
		const user = userList.filter(user => {
			return user.user_id == userId;
		});
		console.log(user);
		connectionPathList.push(user);

		/*
		connectionPathList.push({
			"userId": userId,
			"displayName": 
		});
		*/
	});

	console.log(path);
	res.send(connectionPathList);
}

module.exports = router;
