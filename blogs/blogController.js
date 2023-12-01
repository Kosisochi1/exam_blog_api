const BlogModel = require('../model/blogModel');
const { createUser } = require('../users/userCOntroller');
const logger = require('../logger/index');

const createBlog = async (req, res) => {
	try {
		const reqBody = req.body;
		// console.log(req.userExist._conditions._id);
		logger.info('[CreateBlog] => create blog process started');

		const findTitle = await BlogModel.findOne({ title: req.body.title });
		if (findTitle) {
			logger.info('[CreateBlog] => Title found');

			return res.status(409).json({
				massage: 'tile exit already',
			});
		}
		const blog = await BlogModel.create({
			title: req.body.title,
			description: req.body.description,
			// author: req.body.author,
			body: req.body.body,
			tags: req.body.tags,
			state: req.body.state,
			read_count: req.body.read_time,
			read_time: readTime(req.body.body),
			userId: req.userExist.userId,
		});
		logger.info('[CreateBlog] =>  blog created');

		return res.status(200).json({
			massage: 'blog created',
			data: {
				blog,
			},
		});
	} catch (error) {
		return res.status(500).json({
			massage: error.massage,
		});
	}
};
// read_time
const readTime = (req) => {
	logger.info('[Wordcount] => word count process started');

	const bodyContent = req;
	content = bodyContent;
	const words = content.match(/\w+/g).length;
	const wpm = 200;
	const time = words / wpm;
	return time;
};

// const read_count = (req) => {

// }
const getAllPublish = async (req, res) => {
	try {
		const { author, tags, title, sort } = req.query;
		const queryObject = {};
		if (author) {
			queryObject.author = { $regex: author, $options: 'i' };
		}
		if (tags) {
			queryObject.tags = tags;
		}
		if (title) {
			queryObject.title = { $regex: title, $options: 'i' };
		}

		let result = BlogModel.find(queryObject);
		if (sort) {
			const sortList = sort.split(',').join(' ');
			result = result.sort(sortList);
		} else {
			result = result.sort('read_time');
		}
		const page = req.query.page || 1;
		const limit = req.query.limit || 5;
		const skip = (page - 1) * limit;
		result = result.skip(skip).limit(limit);

		const blogs = await result
			.populate({
				path: 'userId',
				select: 'first_name last_name email',
			})
			.exec();
		// .skip(skip)
		// .limit(limit)
		// .sort(orderBy)
		// .exec();
		return res.status(200).json({
			massage: 'all list returned by search criteria',
			data: {
				blogs,
				// author: blogs.author,
				totalDoc: blogs.length,
			},
		});

		// const reqQuery = req.query;

		// if (req.query.author) {
		// 	const blogs = await BlogModel.find({
		// 		state: 'published',
		// 		author,
		// 	}).limit(20);

		// 	logger.info('[Return Blog] => return all published blog list by author');

		// 	return res.status(200).json({
		// 		massage: 'all blog list by author',
		// 		data: {
		// 			blogs,
		// 		},
		// 	});
		// } else if (req.query.tags) {
		// 	const blogs = await BlogModel.find({ state: 'published', tags }).limit(
		// 		20
		// 	);

		// 	logger.info('[Return Blog] => return all published blog list tags');

		// 	return res.status(200).json({
		// 		massage: 'all blog list by tags',
		// 		data: {
		// 			blogs,
		// 		},
		// 	});
		// } else if (req.query.title) {
		// 	const blogs = await BlogModel.find({ state: 'published', title }).limit(
		// 		20
		// 	);

		// 	logger.info('[Return Blog] => return all published blog list title');

		// 	return res.status(200).json({
		// 		massage: 'all blog list by title',
		// 		data: {
		// 			blogs,
		// 		},
		// 	});
		// } else if (req.query.order) {
		// 	const blogs = await BlogModel.find({ state: 'published' })
		// 		.limit(20)
		// 		.sort({ read_count: 'desc' });

		// 	logger.info('[Return Blog] => return all published blog list');

		// 	return res.status(200).json({
		// 		massage: 'all blog list',
		// 		data: {
		// 			blogs,
		// 		},
		// 	});
		// } else if (req.query.order) {
		// 	const blogs = await BlogModel.find({ state: 'published' })
		// 		.limit(20)
		// 		.sort({ read_time: 'asc' });

		// 	logger.info('[Return Blog] => return all published blog list');

		// 	return res.status(200).json({
		// 		massage: 'all blog list',
		// 		data: {
		// 			blogs,
		// 		},
		// 	});
		// } else if (req.query.order) {
		// 	const blogs = await BlogModel.find({ state: 'published' })
		// 		.limit(20)
		// 		.sort({ timestamps: 'desc' });

		// 	logger.info('[Return Blog] => return all published blog list');

		// 	return res.status(200).json({
		// 		massage: 'all blog list',
		// 		data: {
		// 			blogs,
		// 		},
		// 	});
		// }
		// const blogs = await BlogModel.find({ state: 'published' })
		// 	.limit(20)
		// 	.sort({ read_count: 'asc' });

		// logger.info('[Return Blog] => return all published blog list');

		// return res.status(200).json({
		// 	massage: 'all blog list',
		// 	data: {
		// 		blogs,
		// 	},
		// });
	} catch (error) {
		return res.status(500).json({
			massage: error.massage,
		});
	}
};
const getOnePublished = async (req, res) => {
	try {
		const reqParam = req.params.id;

		const singlePublish = await BlogModel.findOne({
			state: 'published',
			_id: reqParam,
		})
			.populate({
				path: 'userId',
				select: 'first_name',
			})
			.exec();
		// .select({ body: singlePublish.body, author: singlePublish.author });

		if (!singlePublish) {
			return res.status(404).json({
				massage: 'Nothing Found',
			});
		}
		singlePublish.read_count += 1;
		await singlePublish.save();
		logger.info('[Return Blog] => return one published blog ');

		return res.status(200).json({
			massage: 'Single Item',
			data: {
				// singlePublish,
				body: singlePublish.body,
				author: singlePublish.userId.first_name,
				readCount: singlePublish.read_count,
			},
		});
	} catch (error) {
		return res.status(500).json({
			massage: error.massage,
		});
	}
};
const publishOwnBlog = async (req, res) => {
	try {
		const reqParam = req.params.id;

		const findBlog = await BlogModel.findOne({
			_id: reqParam,
			userId: req.userExist.userId,
		});
		if (findBlog) {
			const updataToPublish = await BlogModel.updateOne(
				{ _id: reqParam },
				{
					state: 'published',
				}
			);
			logger.info('[Return Blog] =>  blog published');

			return res.status(200).json({
				massage: 'Published',
				data: {
					updataToPublish,
				},
			});
		} else {
			logger.info('[Return Blog] => you can not published blog ');

			return res.status(401).json({
				massage: ' Your not Authorised',
			});
		}
	} catch (error) {
		return res.status(500).json({
			massage: error.massage,
		});
	}
};
const edithOwnBlog = async (req, res) => {
	try {
		const reqBody = req.body;
		const reqParam = req.params.id;
		const findBlog = await BlogModel.findOne({
			_id: reqParam,
			userId: req.userExist.userId,
		});
		if (findBlog) {
			const edithblog = await BlogModel.updateMany({ _id: reqParam }, reqBody);
			logger.info('[Return Blog] => blog edited ');

			return res.status(200).json({
				massage: 'Edit completed',
				data: {
					edithblog,
				},
			});
		} else {
			logger.info('[Return Blog] => you can not edit blog');

			return res.status(401).json({
				massage: ' Your not Authorised',
			});
		}
	} catch (error) {
		return res.status(500).json({
			massage: error.massage,
		});
	}
};
const deleteOwnBlog = async (req, res) => {
	try {
		const reqBody = req.body;
		const reqParam = req.params.id;
		const findBlog = await BlogModel.findOne({
			_id: reqParam,
			userId: req.userExist.userId,
		});
		if (findBlog) {
			const deleteblog = await BlogModel.deleteMany({ _id: reqParam });
			logger.info('[Return Blog] =>  blog deleted');

			return res.status(200).json({
				massage: 'Blog Deleted',
				data: {
					deleteblog,
				},
			});
		} else {
			logger.info('[Return Blog] => you can not delete blog');

			return res.status(401).json({
				massage: ' Your not Authorised',
			});
		}
	} catch (error) {
		return res.status(500).json({
			massage: error.massage,
		});
	}
};
const getOwnBlog = async (req, res) => {
	try {
		const { state } = req.query;
		const qeuryObject = { userId: req.userExist.userId };
		if (state) {
			qeuryObject.state = state === draft ? draft : published;
		}
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 3;
		const skip = (page - 1) * limit;
		const blogs = await BlogModel.find(qeuryObject).skip(skip).limit(limit);
		return res.status(200).json({
			massage: 'Own Blog List',
			data: {
				blogs,
			},
		});

		// if (req.query.state === 'draft') {
		// 	const blogs = await BlogModel.find({
		// 		userId: req.userExist._conditions._id,
		// 		state: 'draft',
		// 	})
		// 		.limit(limit * 1)
		// 		.skip((page - 1) * limit)
		// 		.exec();
		// 	return res.status(200).json({
		// 		massage: 'Own Blog list',
		// 		data: {
		// 			blogs,
		// 		},
		// 	});
		// } else if (req.query.state === 'published') {
		// 	const blogs = await BlogModel.find({
		// 		userId: req.userExist._conditions._id,
		// 		state: 'published',
		// 	})
		// 		.limit(limit * 1)
		// 		.skip((page - 1) * limit)
		// 		.exec();
		// 	return res.status(200).json({
		// 		massage: 'Own Blog list',
		// 		data: {
		// 			blogs,
		// 		},
		// 	});
		// } else {
		// 	const blogs = await BlogModel.find({
		// 		userId: req.userExist._conditions._id,
		// 	})
		// 		.limit(limit * 1)
		// 		.skip((page - 1) * limit)
		// 		.exec();
		// 	logger.info('[Return Blog] => return all own blog list');

		// 	return res.status(200).json({
		// 		massage: 'Own Blog list',
		// 		data: {
		// 			blogs,
		// 		},
		// 	});
		// }
	} catch (error) {
		return res.status(500).json({
			massage: error.massage,
		});
	}
};

module.exports = {
	createBlog,
	getAllPublish,
	getOnePublished,
	publishOwnBlog,
	edithOwnBlog,
	deleteOwnBlog,
	getOwnBlog,
};
