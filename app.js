const express = require('express');
const userRouter = require('./users/userRouter');
const bodyParser = require('body-parser');
const blogRouter = require('./blogs/blogsRouter');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.use('/v1', userRouter);
//v1/user/login
//v1/user/signup
app.use('/v1', blogRouter);
//v1/allBlog
//v1/singleBlog/:id
//v1/publishedBlog/:id
//v1/edith/:id
//v1/deleteBlog/:id
//v1/ownblog

module.exports = app;
