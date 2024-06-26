const UserModel = require("../model/userModel");
const logger = require("../logger/index");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const createUser = async (req, res) => {
  try {
    const { first_name, last_name, password, email } = req.body;
    logger.info("[createUser] => Create user process started");
    const checkUser = await UserModel.findOne({ email: email });
    logger.info("[createUser] => check if User exist");
    if (checkUser) {
      logger.info("[createUser] =>  User exist");
      return res.status(409).json({
        massage: "User already existed",
      });
    }
    // First registered is an admin !!!

    const isFirstUser = (await UserModel.countDocuments({})) === 0;
    const role = isFirstUser ? "admin" : "user";

    const blogUser = await UserModel.create({
      first_name,
      last_name,
      password,
      email,
      role,
    });

    const token = await jwt.sign(
      { email: blogUser.email, _id: blogUser._id, role: blogUser.role },
      process.env.SECRETE_KEY
    );
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
      maxAge: oneDay,
      httpOnly: true,
      secured: true,
    });
    logger.info("[createUser] => User successfully created");

    return res.status(201).json({
      massage: "User Created successfully",
      data: {
        blogUser,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      massage: "Internal Server Error",
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
        massage: "User not Found",
      });
    }
    const validatePassword = await userExist.isValidPassword(reqLogin.password);
    if (!validatePassword) {
      return res.status(401).json({
        massage: "Incorrect email or Password",
      });
    }

    const token = await jwt.sign(
      { email: userExist.email, _id: userExist._id, role: userExist.role },
      process.env.SECRETE_KEY,
      { expiresIn: "1h" }
    );
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
      maxAge: oneDay,
      httpOnly: true,
      secured: true,
    });
    return res.status(200).json({
      massage: "Login successfull",
      data: {
        userExist,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      massage: "Internal Server error",
    });
  }
};
const logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ masg: "Logout" });
};

module.exports = {
  createUser,
  loginUser,
  logout,
};
