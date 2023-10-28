const express = require('express');
const userRouter = require('./users/userRouter');
const bodyParser = require('body-parser');
const blogRouter = require('./blogs/blogsRouter');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.use('/v1', userRouter);
app.use('/v1', blogRouter);

module.exports = app;
