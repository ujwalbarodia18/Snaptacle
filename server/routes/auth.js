const jwt = require("jsonwebtoken");

const authenticateMiddleware = (req, res, next) => {
	const token = req.body.authorization ? req.body.authorization : req.headers.authorization;
	console.log('In real')
	console.log('token: ', token)
	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	  }
	// const token = req.body.authorization;
	// console.log(token)
	// Verify the token
	jwt.verify(token, "abcdefghijklmnopqrstuvwxyz", (err, decodedToken) => {
		// if (err) {
		// 	return res.status(401).json({ message: "Unauthorized" });
		// }

		req.userId = decodedToken.userId;

		next();
	});
};

module.exports = authenticateMiddleware