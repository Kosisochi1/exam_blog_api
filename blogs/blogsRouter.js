const express = require("express");
const controller = require("./blogController");
const middleware = require("./blogMiddleware");
const {
  authenticateCookie,
  authenticateToken,
} = require("../auth/authorization");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post(
  "/create_blog",
  authenticateCookie,
  middleware.validateBlog,
  controller.createBlog
);
router.get("/all_published_Blog", authenticateCookie, controller.getAllPublish);

router.get("/all_Blog", authenticateCookie, controller.getAllBlogs);

router.get("/ownblog", authenticateCookie, controller.getOwnBlog);
router.get("/singleBlog/:id", controller.getOnePublished);
router.patch("/publishBlog/:id", authenticateCookie, controller.publishOwnBlog);
router.put(
  "/edith/:id",
  // middleware.validateBlog,
  authenticateCookie,
  controller.edithOwnBlog
);
router.delete("/deleteBlog/:id", authenticateCookie, controller.deleteOwnBlog);

router.post("/blog_photos", upload.single("file"), controller.file_upload);

module.exports = router;
