const UserModel = require('../model/userModel');
const logger = require('../logger/index');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const createUser = async (req, res) => {
	try {
		const reqBody = req.body;
		logger.info('[createUser] => Create user process started');
		const checkUser = await UserModel.findOne({ email: reqBody.email });
		logger.info('[createUser] => check if User exist');
		if (checkUser) {
			logger.info('[createUser] =>  User exist');
			return res.status(409).json({
				massage: 'User already existed',
			});
		}
		const blogUser = await UserModel.create(reqBody);

		const token = await jwt.sign(
			{ email: blogUser.email, _id: blogUser._id },
			process.env.SECRETE_KEY
		);
		logger.info('[createUser] => User successfully created');
		return res.status(201).json({
			massage: 'User Created successfully',
			data: {
				blogUser,
				token,
			},
		});
	} catch (error) {
		return res.status(500).json({
			massage: error.massage,
		});
	}
};
const loginUser = async (req, res) => {
	try {
		const reqLogin = req.body;
		const userExist = await UserModel.findOne({ email: reqLogin.email });
		if (!userExist) {
			console.log(userExist);
			return res.status(404).json({
				massage: 'User not Found',
			});
		}
		const validatePassword = await userExist.isValidPassword(reqLogin.password);
		if (!validatePassword) {
			return res.status(401).json({
				massage: 'Incorrect email or Password',
			});
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
		return res.status(200).json({
			massage: 'Login successfull',
			data: {
				userExist,
				token,
			},
		});
	} catch (error) {
		return res.status(500).json({
			massage: 'Server error',
		});
	}
};

const profile_photo = async (req, res) => {
	try {
		const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);

		fs.unlink(req.file.path, (err) => {
			if (err) {
				console.error(err);
				return;
			}
		});

		return res.json({
			data: cloudinaryResponse,
			error: null,
		});
	} catch (error) {
		return res.status(500).json({
			massage: error.massage,
		});
	}
};

module.exports = {
	createUser,
	loginUser,
	profile_photo,
};
