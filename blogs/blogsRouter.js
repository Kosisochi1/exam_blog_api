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
  authenticateToken,
  middleware.validateBlog,
  controller.createBlog
);
router.get("/all_published_Blog", authenticateToken, controller.getAllPublish);

router.get("/all_Blog", authenticateToken, controller.getAllBlogs);

router.get("/singleBlog/:id", controller.getOnePublished);
router.patch("/publishBlog/:id", authenticateToken, controller.publishOwnBlog);
router.put(
  "/edith/:id",
  // middleware.validateBlog,
  authenticateToken,
  controller.edithOwnBlog
);
router.delete("/deleteBlog/:id", authenticateToken, controller.deleteOwnBlog);
router.get("/ownblog", authenticateToken, controller.getOwnBlog);

router.post("/blog_photos", upload.single("file"), controller.file_upload);

module.exports = router;
