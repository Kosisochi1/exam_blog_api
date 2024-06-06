const express = require("express");
const controller = require("./userCOntroller");
const middleware = require("./userMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const {
  auhtorisePermission,
  authenticateCookie,
  checkPermission,
} = require("../auth/authorization");

const router = express.Router();

router.post("/user/signup", middleware.validatUser, controller.createUser);
router.post("/user/login", middleware.validateLoginUser, controller.loginUser);
router.post(
  "/user/profile_photos",
  upload.single("photo"),

  controller.profile_photo
);
router.get("/user/logout", controller.logout);
router.get(
  "/user/getAllUsers",
  authenticateCookie,
  auhtorisePermission("admin"),
  controller.getAllUsers
);
router.get(
  "/user/showCurrentUser",
  authenticateCookie,
  controller.showCurrentUser
);
router.patch("/user/updateUser", authenticateCookie, controller.updateUser);
router.patch(
  "/user/updatePassword",
  authenticateCookie,
  controller.updateUserPassword
);
router.get(
  "/user/singleUser/:id",
  authenticateCookie,
  controller.getSingleUser
);
module.exports = router;
