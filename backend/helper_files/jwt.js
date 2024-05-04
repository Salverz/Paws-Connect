const jwt = require('jsonwebtoken');

function generateToken(userId) {
	return jwt.sign({ userId }, 'secret', {expiresIn: '1h' });
}

function verifyToken(token) {
	return jwt.verify(token, 'secret');
}

function checkAuthenticated(req, res, next) {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = verifyToken(token);
		console.log("DECODED: " + decoded);
		if (decoded.userId == null) {
			return res.sendStatus(401);
		}
		req.userId = decoded.userId;
	} catch (error) {
		console.log(error);
		return res.sendStatus(401);	
	}
	console.log("logged in with userId " + req.userId);
	next();
}

module.exports = { generateToken, verifyToken, checkAuthenticated };
