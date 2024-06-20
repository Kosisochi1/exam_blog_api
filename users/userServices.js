const UserModel = require("../model/userModel");
const logger = require("../logger/index");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

require("dotenv").config();

const createUser = async ({ first_name, last_name, email, password }) => {
  const reqBody = { first_name, last_name, email, password };
  try {
    // const reqBody = req.body;
    logger.info("[createUser] => Create user process started");
    const checkUser = await UserModel.findOne({ email: reqBody.email });
    logger.info("[createUser] => check if User exist");
    if (checkUser) {
      logger.info("[createUser] =>  User exist");
      // return res.status(409).json({
      // 	massage: 'User already existed',
      // });
      return {
        massage: "User already existed",
        code: 409,
      };
    }
    const isFirstUser = (await UserModel.countDocuments({})) === 0;
    const role = isFirstUser ? "admin" : "user";
    const blogUser = await UserModel.create(reqBody);

    const token = await jwt.sign(
      { email: blogUser.email, _id: blogUser._id },
      process.env.SECRETE_KEY
    );
    res.cookie("token", token, {
      maxAge: oneDay,
      httpOnly: true,
      secured: true,
    });
    logger.info("[createUser] => User successfully created");
    return {
      massage: "User Created successfully",
      code: 201,
      data: {
        blogUser,
        token,
      },
    };
  } catch (error) {
    return {
      massage: "Internal Server Error",
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
        massage: "User not Found",
        code: 404,
      };
    }
    const validatePassword = await userExist.isValidPassword(reqLogin.password);
    if (!validatePassword) {
      return {
        massage: "Incorrect email or Password",
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
      { expiresIn: "1h" }
    );
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
      maxAge: oneDay,
      httpOnly: true,
      secured: true,
    });
    return {
      massage: "Login successfull",
      code: 200,
      data: {
        userExist,
        token,
      },
    };
  } catch (error) {
    return {
      code: 500,
      massage: " Internal Server error",
    };
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

    return {
      data: cloudinaryResponse,
      error: null,
    };
  } catch (error) {
    return {
      massage: error,
      code: 500,
    };
  }
};
const logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ masg: "Logout" });
};

const getAllUsers = async ({}) => {
  const user = await UserModel.find({ role: "user" }).select("-password");
  return { user, code: 200 };
};

const showCurrentUser = async ({ user }) => {
  return { user };
};
const updateUser = async ({ email, first_name, last_name }) => {
  //   const { email, first_name, last_name } = req.body;

  if (!email || !last_name || !first_name) {
    return { massage: "Please provide all fields", code: 400 };
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
  return { user, token, code: 200 };
};
const updateUserPassword = async ({ oldPassword, newPassword }) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return { massage: "Provide Passwords", code: 400 };
  }
  const user = await UserModel.findOne({ _id: req.user._id });
  // check if old password is correct

  const isPasswordValid = await user.isValidPassword(oldPassword);
  if (!isPasswordValid) {
    return { massage: "Invalid Password", code: 403 };
  }

  user.password = newPassword;
  await user.save();
  return { massage: "Password updated", code: 200 };
};
const getSingleUser = async ({}) => {
  const user = await UserModel.findOne({ _id: req.params.id }).select(
    "-password"
  );
  if (!user) {
    return { msg: `No User with ${req.params.id}`, code: 404 };
  }

  if (req.user.role !== "admin") {
    return { massage: "User unathourize", code: 403 };
  }
  if (req.user._id === user._id) {
    return;
  }
  return { user, code: 200 };
};
module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  logout,
  updateUser,
  updateUserPassword,
  profile_photo,
  showCurrentUser,
};
