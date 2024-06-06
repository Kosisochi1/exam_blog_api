const express = require("express");
const controller = require("./blogController");
const middleware = require("./blogMiddleware");
const authMiddleware = require("../auth/authorization");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post(
  "/create_blog",
  authMiddleware.authenticateToken,
  middleware.validateBlog,
  controller.createBlog
);
router.get(
  "/all_published_Blog",
  authMiddleware.authenticateToken,
  controller.getAllPublish
);

router.get(
  "/all_Blog",
  authMiddleware.authenticateCookie,
  controller.getAllBlogs
);

router.get("/singleBlog/:id", controller.getOnePublished);
router.patch(
  "/publishBlog/:id",
  authMiddleware.authenticateToken,
  controller.publishOwnBlog
);
router.put(
  "/edith/:id",
  // middleware.validateBlog,
  authMiddleware.authenticateToken,
  controller.edithOwnBlog
);
router.delete(
  "/deleteBlog/:id",
  authMiddleware.authenticateToken,
  controller.deleteOwnBlog
);
router.get("/ownblog", authMiddleware.authenticateToken, controller.getOwnBlog);

router.post("/blog_photos", upload.single("file"), controller.file_upload);

module.exports = router;
