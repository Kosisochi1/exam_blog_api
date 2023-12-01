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
		req.userExist = { userId: verifyToken._id };
		next();
	} catch (error) {
		return res.status(401).json({
			massage: 'You are not Authenticated',
			error,
		});
	}
};

const authenticate = async (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		try {
			const decodedValue = await jwt.verify(token, process.env.SECRETE_KEY);

			res.locals.loginUser = { _id: decodedValue._id };
			next();
		} catch (error) {
			res.redirect('index');
		}
	} else {
		res.redirect('index');
	}
};

module.exports = {
	authenticateToken,
	authenticate,
};
