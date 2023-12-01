const UserModel = require('../model/userModel');
const logger = require('../logger/index');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const createUser = async ({ first_name, last_name, email, password }) => {
	const reqBody = { first_name, last_name, email, password };
	try {
		// const reqBody = req.body;
		logger.info('[createUser] => Create user process started');
		const checkUser = await UserModel.findOne({ email: reqBody.email });
		logger.info('[createUser] => check if User exist');
		if (checkUser) {
			logger.info('[createUser] =>  User exist');
			// return res.status(409).json({
			// 	massage: 'User already existed',
			// });
			return {
				massage: 'User already existed',
				code: 409,
			};
		}
		const blogUser = await UserModel.create(reqBody);

		const token = await jwt.sign(
			{ email: blogUser.email, _id: blogUser._id },
			process.env.SECRETE_KEY
		);
		logger.info('[createUser] => User successfully created');
		return {
			massage: 'User Created successfully',
			code: 201,
			data: {
				blogUser,
				token,
			},
		};
	} catch (error) {
		return {
			massage: error.massage,
			code: 500,
		};
	}
};
const loginUser = async ({ email, password }) => {
	try {
		const reqLogin = { email, password };
		const userExist = await UserModel.findOne({ email: reqLogin.email });
		if (!userExist) {
			console.log(userExist);
			return {
				massage: 'User not Found',
				code: 404,
			};
		}
		const validatePassword = await userExist.isValidPassword(reqLogin.password);
		if (!validatePassword) {
			return {
				massage: 'Incorrect email or Password',
				code: 401,
			};
		}
		// const token = await jwt.sign(
		// 	{ email: userExist.email, first_name: userExist.first_name },
		// 	process.env.SECRETE_KEY,
		// 	{ expiresIn: '1h' }
		// );
		const token = await jwt.sign(
			{ email: userExist.email, _id: userExist._id },
			process.env.SECRETE_KEY,
			{ expiresIn: '1h' }
		);
		return {
			massage: 'Login successfull',
			code: 200,
			data: {
				userExist,
				token,
			},
		};
	} catch (error) {
		return {
			code: 500,
			massage: 'Server error',
		};
	}
};

module.exports = {
	createUser,
	loginUser,
};
