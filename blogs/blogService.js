const BlogModel = require('../model/blogModel');
const fs = require('fs')
const cloudinary = require('cloudinary').v2

const createBlog = async ({
	title,
	description,
	body,
	tags,
	read_time,
	userId,
}) => {
	try {
		const reqBody = { title, description, body, tags, read_time, userId };
		const findTitle = await BlogModel.findOne({
			title: reqBody.title,
		});
		if (findTitle) {
			return {
				massage: 'Title exit already',
				code: 409,
			};
		}

		const blog = await BlogModel.create({
			title: reqBody.title,
			description: reqBody.description,
			author: req.body.author,
			body: reqBody.body,
			tags: reqBody.tags,
			state: reqBody.state,
			read_count: reqBody.read_count,
			read_time: readTime(reqBody.body),
			userId: res.locals.loginUser._id,});
		return {
			massage: 'Blog created',
			code: 201,
			data: { blog },
		};
	} catch (error) {
		return {
			code: 500,
			massage: 'internal error',
		};
	}
};
const readTime = (rBody) => {
	logger.info('[Wordcount] => word count process started');

	const bodyContent = String(rBody);
	contents = bodyContent;
	const words = contents.match(/\w+/g).length;
	const wpm = 200;
	const time = words / wpm;
	return time;
};
const getAllPublish = async ({ author, tags, title, sort }) => {
	try {
		const reqQuery = { author, tags, title, sort };
		const queryObject = {state:'published'};
		if (reqQuery.author) {
			queryObject.author = { $regex: author, $options: 'i' };
		}
		if (reqQuery.tags) {
			queryObject.tags = tags;
		}
		if (reqQuery.title) {
			queryObject.title = { $regex: title, $options: 'i' };
		}

		let result = BlogModel.find(queryObject);
		if (reqQuery.sort) {
			const sortList = sort.split(',').join(' ');
			result = result.sort(sortList);
		} else {
			result = result.sort('read_time');
		}
		const page = reqQuery.page || 1;
		const limit = reqQuery.limit || 20;
		const skip = (page - 1) * limit;
		result = result.skip(skip).limit(limit);

		const blogs = await result
			.populate({
				path: 'userId',
				select: 'first_name last_name email',
			})
			.exec();
		return {
			massage: 'all list returned by search criteria',
			data: {
				blogs,
				// author: blogs.author,
				totalDoc: blogs.length,
			},
		};
	} catch (error) {
		return {
			massage: error.massage,
		};
	}
};
const getAllBlogs = async ({ author, tags, title, sort }) => {
	try {
		const reqQuery = { author, tags, title, sort };
		const queryObject = {};
		if (reqQuery.author) {
			queryObject.author = { $regex: author, $options: 'i' };
		}
		if (reqQuery.tags) {
			queryObject.tags = tags;
		}
		if (reqQuery.title) {
			queryObject.title = { $regex: title, $options: 'i' };
		}

		let result = BlogModel.find(queryObject);
		if (reqQuery.sort) {
			const sortList = sort.split(',').join(' ');
			result = result.sort(sortList);
		} else {
			result = result.sort('read_time');
		}
		const page = reqQuery.page || 1;
		const limit = reqQuery.limit || 20;
		const skip = (page - 1) * limit;
		result = result.skip(skip).limit(limit);

		const blogs = await result
			.populate({
				path: 'userId',
				select: 'first_name last_name email',
			})
			.exec();
		return {
			massage: 'all list returned by search criteria',
			data: {
				blogs,
				// author: blogs.author,
				totalDoc: blogs.length,
			},
		};
	} catch (error) {
		return {
			massage: error.massage,
		};
	}
};
const getOnePublished = async ({ _id, state }) => {
	try {
		const reqParam = { _id, state };

		const singlePublish = await BlogModel.findOne({
			_id: reqParam._id,
			state: 'published',
		});
		// .populate({
		// 	path: 'userId',
		// 	select: 'first_name',
		// })
		// .exec();
		// .select({ body: singlePublish.body, author: singlePublish.author });

		if (!singlePublish) {
			return {
				massage: 'Nothing Found',
				code: 404,
			};
		}
		singlePublish.read_count += 1;
		await singlePublish.save();
		logger.info('[Return Blog] => return one published blog ');

		return {
			massage: 'Single Item',
			data: {
				singlePublish,
				// body: singlePublish.body,
				// author: singlePublish.userId.first_name,
				// readCount: singlePublish.read_count,
			},
		};
	} catch (error) {
		return {
			massage: 'internal server error',
			code: 500,
		};
	}
};
const publishOwnBlog = async ({ _id, userId }) => {
	try {
		const reqParam = { _id, userId };

		const findBlog = await BlogModel.findOne({
			_id: reqParam._id,
			// userId: res.locals.loginUser._id,
		});
		if (findBlog) {
			const updataToPublish = await BlogModel.updateOne(
				{ _id: reqParam._id },
				{
					state: 'published',
				}
			);
			logger.info('[Return Blog] =>  blog published');

			return {
				massage: 'Published',
				code: 200,
				data: {
					updataToPublish,
				},
			};
		} else {
			logger.info('[Return Blog] => you can not published blog ');

			return {
				code: 401,
				massage: ' Your not Authorised',
			};
		}
	} catch (error) {
		return {
			massage: error.massage,
			code: 500,
		};
	}
};
const edithOwnBlog = async ({ title, description, body, tags, _id }) => {
	try {
		logger.info('[Return Blog] => blog edith started ');
		const reqBody = { title, description, body, tags, userId };
		// const reqParam = { _id };
		const reqId = { _id };

		const edithblog = await BlogModel.updateMany(
			{ _id: reqId._id },

			{
				title: reqBody.title,
				description: reqBody.description,
				tags: reqBody.tags,
				body: reqBody.body,
			},

			{ new: true }
		);
		logger.info('[Return Blog] => blog edited ');

		return {
			massage: 'Edit completed',
			code: 200,
			data: {
				edithblog,
			},
		};
	} catch (error) {
		return {
			massage: error.massage,
			code: 500,
		};
	}
};
const deleteOwnBlog = async ({ _id }) => {
	try {
		const reqParam = { _id };
		const findBlog = await BlogModel.findById({
			_id: reqParam._id,
			userId: res.locals.loginUser._id,
		});
		logger.info('[Return Blog] =>  blog deleted');
		if (findBlog) {
			const deleteblog = await BlogModel.findByIdAndDelete(reqParam);

			return {
				massage: 'Blog Deleted',
				data: {
					code: 200,
					deleteblog,
				},
			};
		} else {
			logger.info('[Return Blog] => you can not delete blog');

			return {
				massage: ' Your not Authorised',
				code: 401,
			};
		}
	} catch (error) {
		return {
			massage: error.massage,
			code: 500,
		};
	}
};
const getOwnBlog = async ({ state, userId }) => {
	try {
		const reqBody = { state, userId };
		const qeuryObject = {userId:res.locals.loginUser._id};
		if (reqBody.state) {
			qeuryObject.reqBody.state = state === 'draft' ? 'draft' : 'published';
		}
		const page = Number(reqBody.page) || 1;
		const limit = Number(reqBody.limit) || 10;
		const skip = (page - 1) * limit;
		const blogs = await BlogModel.find(qeuryObject).skip(skip).limit(limit);
		return {
			massage: 'Own Blog List',
			code: 200,
			data: {
				blogs,
			},
		};
	} catch (error) {
		return {
			massage: 'internal server error',
			code: 500,
		};
	}
};
const findBlog = async ({ _id, userId }) => {
	const reqParam = { _id, userId };
	const item = await BlogModel.findOne({
		_id: reqParam._id,
		// userId: res.locals.loginUser._id,
	});
	return {
		data: { item },
	};
};
const getOneBlog = async ({ _id, state }) => {
	try {
		const reqParam = { _id, state };

		const singlePublish = await BlogModel.findOne({
			_id: reqParam._id,
		});
		// .populate({
		// 	path: 'userId',
		// 	select: 'first_name',
		// })
		// .exec();
		// .select({ body: singlePublish.body, author: singlePublish.author });

		if (!singlePublish) {
			return {
				massage: 'Nothing Found',
				code: 404,
			};
		}
		singlePublish.read_count += 1;
		await singlePublish.save();
		logger.info('[Return Blog] => return one published blog ');

		return {
			massage: 'Single Item',
			data: {
				singlePublish,
				// body: singlePublish.body,
				// author: singlePublish.userId.first_name,
				// readCount: singlePublish.read_count,
			},
		};
	} catch (error) {
		return {
			massage: 'internal server error',
			code: 500,
		};
	}
};

const file_upload = async (rBody) => {
	try {
		// const reqBody = req.file.path
		const cloudinaryResponse = await cloudinary.uploader.upload(rBody);

		fs.unlink(rBody, (err) => {
			if (err) {
				console.error(err);
				return;
			}
		});

		return {
			data: cloudinaryResponse,
			error: null,
		};
	} catch (error) {
		return {
			code:500,
			massage: error,
		};
	}
};



module.exports = {
	file_upload,
	findBlog,
	createBlog,
	getAllPublish,
	getAllBlogs,
	getOnePublished,
	publishOwnBlog,
	edithOwnBlog,
	deleteOwnBlog,
	getOwnBlog,
	readTime,
	getOneBlog,
};
