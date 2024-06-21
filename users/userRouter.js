const express = require("express");
const controller = require("./user");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const {
  auhtorisePermission,
  authenticateCookie,
  checkPermission,
  authenticateToken,
} = require("../auth/authorization");

const router = express.Router();

router.post(
  "/user/profile_photos",
  upload.single("photo"),

  controller.profile_photo
);
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
