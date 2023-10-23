const mongoose = require('mongoose');
require('dotenv').config();

const connect = async (url) => {
	mongoose.connect(url || process.env.DB_URL);
	mongoose.connection.on('connected', () => {
		console.log('Connection to Database successfull');
	});
	mongoose.connection.on('error', (err) => {
		console.log('Connection to Database not Successfull');
	});
};
module.exports = {
	connect,
};
