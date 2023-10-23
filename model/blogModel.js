const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BlogModel = new Schema(
	{
		title: {
			type: String,
			require: true,
			unique: true,
		},
		description: {
			type: String,
			require: true,
		},
		author: {
			type: String,
			require: true,
		},
		body: {
			type: String,
			require: true,
		},
	},
	{ timestamps: true }
);
