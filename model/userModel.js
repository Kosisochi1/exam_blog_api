const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const UserSchema = new Schema({
	first_name: {
		type: String,
		require: true,
	},
	last_name: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
		unique: true,
	},
	password: {
		type: String,
		require: true,
	},
});
UserSchema.pre('save', async function (next) {
	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;
	next();
});
UserSchema.methods.isValidPassword = async function (password) {
	const comparePassword = await bcrypt.compare(password, this.password);
	return comparePassword;
};

const UserModel = mongoose.model('usermodels', UserSchema);
module.exports = UserModel;
