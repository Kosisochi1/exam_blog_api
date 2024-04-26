const express = require('express');
const controller = require('../users/userServices');
const cookieParser = require('cookie-parser');
const router = express.Router();
const blogs = require('../blogs/blogService');
const blog = require('../blogs/blogController');
const { readTime } = require('../blogs/blogService');
const { authenticate } = require('../auth/authorization');
const { stringify } = require('uuid');

router.use(cookieParser());

router.get('/', (req, res) => {
	res.render('index');
});
// signup code !!! get and post
router.get('/signup', (req, res) => {
	res.render('signup');
});
router.post('/signup', async (req, res) => {
	const response = await controller.createUser({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password,
	});
	if (response.code === 201) {
		res.render('success');
	} else if (response.code === 409) {
		res.render('user_exist');
	} else {
		res.render('error');
	}
});
// login code !!! get and post
router.get('/login', (req, res) => {
	res.render('login');
});
router.post('/login', async (req, res) => {
	const response = await controller.loginUser({
		email: req.body.email,
		password: req.body.password,
	});
	if (response.code === 200) {
		res.cookie('jwt', response.data.token, { maxAge: 60 * 60 * 1000 });
		res.redirect('home');
	} else if (response.code === 404) {
		res.render('404');
	} else if (response.code === 401) {
		res.render('wrongDetails');
	} else {
		res.render('error');
	}
});

// create Blog code !!! get and post
router.get('/createBlog', (req, res) => {
	res.render('createBlog');
});
router.post('/createBlog', authenticate, async (req, res) => {
	const response = await blogs.createBlog({
		title: req.body.title,
		description: req.body.description,
		// author: req.body.author,
		body: req.body.body,
		tags: req.body.tags,
		read_time: readTime(req.body),
		userId: res.locals.loginUser._id,
	});
	res.redirect('home');
});

router.get('/publishblog', (req, res) => {
	res.render('publishblog');
});
router.get('/updateBlog/:id', authenticate, async (req, res) => {
	console.log('here');
	const response = await blogs.findBlog({
		_id: req.params.id,
		userId: res.locals.loginUser._id,
	});
	console.log(response);
	res.render('updateBlog', {
		loginUser: res.locals.loginUser || null,
		findBlog: response.data.item,
	});
});

router.get('/home', async (req, res) => {
	const response = await blogs.getAllPublish({ state: 'published' });

	res.render('home', {
		getAllPublish: response.data.blogs,
		loginUser: res.locals.loginUser || null,
	});
});

router.get('/getOnePublished/:id', authenticate, async (req, res) => {
	const response = await blogs.getOnePublished({
		_id: req.params.id,
		state: 'published',
	});
	console.log(response);
	console.log(req.params.id);
	res.render('getOnePublished', {
		loginUser: res.locals.loginUser || null,
		getOnePublished: response.data.singlePublish,
	});
});
router.get('/getOneBlog/:id', async (req, res) => {
	const response = await blogs.getOneBlog({
		_id: req.params.id,
	});
	console.log(response);
	console.log(req.params.id);
	res.render('oneBlog', {
		loginUser: res.locals.loginUser || null,
		getOneBlog: response.data.singlePublish,
	});
});

router.post('/publishblog/:id', authenticate, async (req, res) => {
	console.log(req.body);
	const response = await blogs.publishOwnBlog({ _id: req.body.delete });
	if (response.code === 200) {
		res.redirect('/views/getOwnBlog');
	} else if (response.code === 401) {
		res.render('unauthorize');
	} else {
		res.render('error');
	}
});
router.get('/getOwnBlog', authenticate, async (req, res) => {
	const response = await blogs.getOwnBlog({
		userId: res.locals.loginUser._id,
	});
	// console.log(response.data.blogs);
	res.render('getOwnBlog', {
		loginUser: res.locals.loginUser || null,
		getOwnBlog: response.data.blogs,
	});
});
router.post('/edithBlog/:id', authenticate, async (req, res) => {
	await blogs.edithOwnBlog(
		{ _id: req.params.id },

		{
			title: reqBody.title,
			description: reqBody.description,
			tags: reqBody.tags,
			body: reqBody.body,
		}
		// paramId: req.params._id,

		// { new: true }
	);
	console.log(req.body);
	// console.log();
	// ();
	// console.log(response.data.edithblog);
	res.redirect('/views/getOwnBlog');
});

router.post('/deleteBlog', authenticate, async (req, res) => {
	console.log('here'),
		await blogs.deleteOwnBlog(
			{ _id: req.body.delete }

			// { new: true }
		);
	// ();
	console.log(req.params);
	console.log(req.body);
	res.redirect('/views/getOwnBlog');
});
router.get('/getQuery', async (req, res) => {
	const { author, tags, title, sort } = req.query;
	const response = await blogs.getAllPublish({ author, tags, title, sort });
	console.log(req.query.search);
	res.render('publishblog', {
		getAllPublish: response.data.blogs,
	});
});

module.exports = router;
