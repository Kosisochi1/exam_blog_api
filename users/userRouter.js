const express = require('express');
const controller = require('./userCOntroller');
const middleware = require('./userMiddleware');

const router = express.Router();

router.post('/user/signup', middleware.validatUser, controller.createUser);
router.post('/user/login', middleware.validateLoginUser, controller.loginUser);

module.exports = router;
