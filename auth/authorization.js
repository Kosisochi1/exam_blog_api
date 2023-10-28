const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
	const reqHeader = req.headers;
	try {
		if (!reqHeader) {
			return res.status(401).json({
				massage: 'You are not authenticad',
			});
		}
		const token = req.headers.authorization.split(' ')[1];
		const verifyToken = jwt.verify(token, process.env.SECRETE_KEY);
		const user = User.findOne({
			email: verifyToken.email,
			_id: verifyToken._id,
		});
		if (!user) {
			return res.status(401).json({ massage: 'You are not Authenticated' });
		}
		req.userExist = user;
		next();
	} catch (error) {
		return res.status(401).json({
			massage: 'You are not Authenticated',
			error,
		});
	}
};
module.exports = {
	authenticateToken,
};
