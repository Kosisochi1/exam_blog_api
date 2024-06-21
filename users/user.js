require("dotenv").config();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const UserModel = require("../model/userModel");

const fs = require("fs");

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

const getAllUsers = async (req, res) => {
  console.log(req.user);
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
  profile_photo,
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
