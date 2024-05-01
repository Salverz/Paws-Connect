const jwt = require('jsonwebtoken');

function generateToken(userId) {
	return jwt.sign({ userId }, 'secret', {expiresIn: '1h' });
}

function verifyToken(token) {
	return jwt.verify(token, 'secret');
}

module.exports = { generateToken, verifyToken };
