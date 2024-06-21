const express = require("express");
const controller = require("./userCOntroller");
const middleware = require("./userMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const router = express.Router();

router.post("/userAuth/signup", middleware.validatUser, controller.createUser);
router.post(
  "/userAuth/login",
  middleware.validateLoginUser,
  controller.loginUser
);
router.get("/userAuth/logout", controller.logout);
// router.get("/user/logout", controller.logout);

module.exports = router;
