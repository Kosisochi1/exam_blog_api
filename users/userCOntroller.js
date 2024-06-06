const UserModel = require("../model/userModel");
const logger = require("../logger/index");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

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
        massage: "User not Found",
      });
    }
    const validatePassword = await userExist.isValidPassword(reqLogin.password);
    if (!validatePassword) {
      return res.status(401).json({
        massage: "Incorrect email or Password",
      });
    }
    // const token = await jwt.sign(
    // 	{ email: userExist.email, first_name: userExist.first_name },
    // 	process.env.SECRETE_KEY,
    // 	{ expiresIn: '1h' }
    // );
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
      massage: "Server error",
    });
  }
};

const profile_photo = async (req, res) => {
  try {
    upload.single("photo");
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
      massage: error,
    });
  }
};
const logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ masg: "Logout" });
};

const getAllUsers = async (req, res) => {
  const user = await UserModel.find({ role: "user" }).select("-password");
  return res.status(200).json({ user });
};

const showCurrentUser = async (req, res) => {
  return res.status(200).json({ user: req.user });
};
const updateUser = async (req, res) => {
  const { email, first_name, last_name } = req.body;

  if (!email || !last_name || !first_name) {
    res.status(400).json({ massage: "Please provide all fields" });
  }
  const user = await UserModel.findOne({ _id: req.user._id });

  user.email = email;
  user.first_name = first_name;
  user.last_name = last_name;
  await user.save();

  const token = jwt.sign(
    { email: user.email, _id: user._id, role: user.role },
    process.env.SECRETE_KEY,
    { expiresIn: "1h" }
  );
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    maxAge: oneDay,
    httpOnly: true,
    secured: true,
  });
  res.status(200).json({ user, token });
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res.status(400).json({ massage: "Provide Passwords" });
  }
  const user = await UserModel.findOne({ _id: req.user._id });
  // check if old password is correct

  const isPasswordValid = await user.isValidPassword(oldPassword);
  if (!isPasswordValid) {
    res.status(403).json({ massage: "Invalid Password" });
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json({ massage: "Password updated" });
};
const getSingleUser = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.params.id }).select(
    "-password"
  );
  if (!user) {
    res.status(404).json({ msg: `No User with ${req.params.id}` });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ massage: "User unathourize" });
  }
  if (req.user._id === user._id) {
    return;
  }
  res.status(200).json({ user });
};

module.exports = {
  createUser,
  loginUser,
  profile_photo,
  logout,
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
