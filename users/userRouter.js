const express = require('express');
const controller = require('./userCOntroller');
const middleware = require('./userMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/user/signup', middleware.validatUser, controller.createUser);
router.post('/user/login', middleware.validateLoginUser, controller.loginUser);
router.post(
	'/user/profile_photos',
	upload.single('photo'),
	controller.profile_photo
);

module.exports = router;
