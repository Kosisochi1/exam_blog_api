const joi = require('joi');
const { schema } = require('../model/userModel');

const validateBlog = async (req, res, next) => {
	const schema = joi.object({
		title: joi.string().required(),
		description: joi.string().required(),
		author: joi.string().required(),
		body: joi.string().required(),
		tags: joi.string(),
	});
	await schema.validateAsync(req.body, { abortEarly: true });
	next();
};

module.exports = {
	validateBlog,
};
