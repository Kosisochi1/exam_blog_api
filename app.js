const express = require('express');
const userRouter = require('./users/userRouter');
const bodyParser = require('body-parser');
const blogRouter = require('./blogs/blogsRouter');
const view_router = require('./views/viewRouter');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
app.use('/views', view_router);
app.use('/v1', userRouter);
//v1/user/login
//v1/user/signup
app.use('/v1', blogRouter);
//v1/allBlog
app.get('/', (req, res) => {
	res.render('index');
});
//v1/allBlog?author=author
//v1/allBlog?tags=tags
//v1/allBlog?title=title
//v1/allBlog?order=read_count
//v1/allBlog?order=read_time
//v1/allBlog?order=timestamps
//v1/singleBlog/:id
//v1/publishedBlog/:id
//v1/edith/:id
//v1/deleteBlog/:id
//v1/ownblog
// app.get('/', (req, res) => {
// 	res.send('you are to my blog app');
// });
app.get('*', (req, res) => {
	return res.status(404).json({
		data: null,
		error: 'Route not found',
	});
});
module.exports = app;
