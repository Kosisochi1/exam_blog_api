const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('./userModel');

const Schema = mongoose.Schema;
const BlogModelSchema = new Schema({
	_id: {
		type: String,
		default: uuidv4,
	},
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
	tags: {
		type: String,
	},
	state: {
		type: String,
		enum: ['draft', 'published'],
		default: 'draft',
	},
	read_count: {
		type: Number,
	},
	read_time: {
		type: String,
		default: 0,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'usermodels',
	},
});
const BlogModel = mongoose.model('blogs', BlogModelSchema);
module.exports = BlogModel;
