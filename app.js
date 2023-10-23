const express = require('express');
const db = require('./db');
const userRouter = require('./users/userRouter');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
app.use(bodyParser.json());
app.use(express.json());

app.use('/v1', userRouter);

db.connect();
app.listen(PORT, () => {
	console.log('Server Started');
});
