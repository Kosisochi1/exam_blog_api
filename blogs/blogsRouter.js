const express = require('express');
const controller = require('./blogController');
const middleware = require('./blogMiddleware');
const authMiddleware = require('../auth/authorization');

const router = express.Router();

router.post(
	'/blog',
	authMiddleware.authenticateToken,
	middleware.validateBlog,
	controller.createBlog
);
router.get('/allBlog', controller.getAllPublish);
router.get('/singleBlog/:id', controller.getOnePublished);
router.patch(
	'/publishBlog/:id',
	authMiddleware.authenticateToken,
	controller.publishOwnBlog
);
router.put(
	'/edith/:id',
	middleware.validateBlog,
	authMiddleware.authenticateToken,
	controller.edithOwnBlog
);
router.delete(
	'/deleteBlog/:id',
	authMiddleware.authenticateToken,
	controller.deleteOwnBlog
);
router.get('/ownblog', authMiddleware.authenticateToken, controller.getOwnBlog);

module.exports = router;
