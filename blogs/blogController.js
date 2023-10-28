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
			author: req.body.author,
			body: req.body.body,
			tags: req.body.tags,
			state: req.body.state,
			read_count: readTime(req.body.body),
			read_time: req.body.read_time,
			userId: req.userExist._conditions._id,
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
	const wpm = 2;
	const time = words / wpm;
	return time;
};
// const read_count = (req) => {

// }
const getAllPublish = async (req, res) => {
	try {
		const { author, tags, title, read_count, read_time, timestamps } =
			req.query;

		const reqQuery = req.query;

		if (req.query.author) {
			const blogs = await BlogModel.find({
				state: 'published',
				author,
			}).limit(20);

			logger.info('[Return Blog] => return all published blog list by author');

			return res.status(200).json({
				massage: 'all blog list by author',
				data: {
					blogs,
				},
			});
		} else if (req.query.tags) {
			const blogs = await BlogModel.find({ state: 'published', tags }).limit(
				20
			);

			logger.info('[Return Blog] => return all published blog list tags');

			return res.status(200).json({
				massage: 'all blog list by tags',
				data: {
					blogs,
				},
			});
		} else if (req.query.title) {
			const blogs = await BlogModel.find({ state: 'published', title }).limit(
				20
			);

			logger.info('[Return Blog] => return all published blog list title');

			return res.status(200).json({
				massage: 'all blog list by title',
				data: {
					blogs,
				},
			});
		} else if (req.query.order) {
			const blogs = await BlogModel.find({ state: 'published' })
				.limit(20)
				.sort({ read_count: 'desc' });

			logger.info('[Return Blog] => return all published blog list');

			return res.status(200).json({
				massage: 'all blog list',
				data: {
					blogs,
				},
			});
		} else if (req.query.order) {
			const blogs = await BlogModel.find({ state: 'published' })
				.limit(20)
				.sort({ read_time: 'asc' });

			logger.info('[Return Blog] => return all published blog list');

			return res.status(200).json({
				massage: 'all blog list',
				data: {
					blogs,
				},
			});
		} else if (req.query.order) {
			const blogs = await BlogModel.find({ state: 'published' })
				.limit(20)
				.sort({ timestamps: 'desc' });

			logger.info('[Return Blog] => return all published blog list');

			return res.status(200).json({
				massage: 'all blog list',
				data: {
					blogs,
				},
			});
		} else {
			const blogs = await BlogModel.find({ state: 'published' })
				.limit(20)
				.sort({ read_count: 'asc' });

			logger.info('[Return Blog] => return all published blog list');

			return res.status(200).json({
				massage: 'all blog list',
				data: {
					blogs,
				},
			});
		}
	} catch (error) {
		return res.status(500).json({
			massage: error.massage,
		});
	}
};
const getOnePublished = async (req, res) => {
	try {
		const reqParam = req.params.id;
		let i = 0;

		const singlePublish = await BlogModel.findOne({
			state: 'published',
			_id: reqParam,
		});
		console.log(req.url);

		if (!singlePublish) {
			return res.status(404).json({
				massage: 'Nothing Found',
			});
		}
		logger.info('[Return Blog] => return one published blog ');

		return res.status(200).json({
			massage: 'Single Item',
			singlePublish,
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
			userId: req.userExist._conditions._id,
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
				data: updataToPublish,
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
			userId: req.userExist._conditions._id,
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
			userId: req.userExist._conditions._id,
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
		const { state = ['draft', 'published'], page = 1, limit = 2 } = req.query;

		if (req.query.state === 'draft') {
			const blogs = await BlogModel.find({
				userId: req.userExist._conditions._id,
				state: 'draft',
			})
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.exec();
			return res.status(200).json({
				massage: 'Own Blog list',
				data: {
					blogs,
				},
			});
		} else if (req.query.state === 'published') {
			const blogs = await BlogModel.find({
				userId: req.userExist._conditions._id,
				state: 'published',
			})
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.exec();
			return res.status(200).json({
				massage: 'Own Blog list',
				data: {
					blogs,
				},
			});
		} else {
			const blogs = await BlogModel.find({
				userId: req.userExist._conditions._id,
			})
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.exec();
			logger.info('[Return Blog] => return all own blog list');

			return res.status(200).json({
				massage: 'Own Blog list',
				data: {
					blogs,
				},
			});
		}
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
