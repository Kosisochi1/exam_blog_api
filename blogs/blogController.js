const BlogModel = require("../model/blogModel");
const { createUser } = require("../usersAuth/userCOntroller");
const logger = require("../logger/index");

const cloudinary = require("../integegration/cloudinary");
const fs = require("fs");

const createBlog = async (req, res) => {
  try {
    const reqBody = req.body;
    // console.log(req.userExist._conditions._id);
    logger.info("[CreateBlog] => create blog process started");

    const findTitle = await BlogModel.findOne({ title: req.body.title });
    if (findTitle) {
      logger.info("[CreateBlog] => Title found");

      return res.status(409).json({
        massage: "tile exit already",
      });
    }
    const blog = await BlogModel.create({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      body: req.body.body,
      tags: req.body.tags,
      state: req.body.state,
      read_count: req.body.read_time,
      read_time: readTime(req.body.body),
      userId: req.user._id,
    });
    logger.info("[CreateBlog] =>  blog created");

    return res.status(201).json({
      massage: "blog created",
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
const readTime = (reqBody) => {
  logger.info("[Wordcount] => word count process started");

  const bodyContent = reqBody;
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

    const queryObject = { state: "published" };

    if (author) {
      queryObject.author = { $regex: author, $options: "i" };
    }
    if (tags) {
      queryObject.tags = tags;
    }
    if (title) {
      queryObject.title = { $regex: title, $options: "i" };
    }

    let result = BlogModel.find(queryObject);
    if (sort) {
      const sortList = sort.split(",").join(" ");
      result = result.sort(sortList);
    } else {
      result = result.sort("read_time");
    }
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const blogs = await result
      .populate({
        path: "userId",
        select: "first_name last_name email",
      })
      .exec();
    // if(req.url ='/all_published_blog'){
    // 	console.log(req.url)
    // }

    return res.status(200).json({
      massage: "all list returned by search criteria",
      data: {
        blogs,
        totalDoc: blogs.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      massage: error.massage,
    });
  }
};
const getAllBlogs = async (req, res) => {
  try {
    const { author, tags, title, sort } = req.query;

    const queryObject = {};

    if (author) {
      queryObject.author = { $regex: author, $options: "i" };
    }
    if (tags) {
      queryObject.tags = tags;
    }
    if (title) {
      queryObject.title = { $regex: title, $options: "i" };
    }

    let result = BlogModel.find(queryObject);
    if (sort) {
      const sortList = sort.split(",").join(" ");
      result = result.sort(sortList);
    } else {
      result = result.sort("read_time");
    }
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const blogs = await result
      .populate({
        path: "userId",
        select: "first_name last_name email",
      })
      .exec();
    // if(req.url ='/all_published_blog'){
    // 	console.log(req.url)
    // }

    return res.status(200).json({
      massage: "all list returned by search criteria",
      data: {
        blogs,
        totalDoc: blogs.length,
      },
    });
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
      state: "published",
      _id: reqParam,
    })
      .populate({
        path: "userId",
        select: "first_name",
      })
      .exec();

    if (!singlePublish) {
      return res.status(404).json({
        massage: "Nothing Found",
      });
    }
    singlePublish.read_count += 1;
    await singlePublish.save();
    logger.info("[Return Blog] => return one published blog ");

    return res.status(200).json({
      massage: "Single Item",
      data: {
        singlePublish,
        // 	body: singlePublish.body,
        Publish_by: singlePublish.userId.first_name,
        // 	readCount: singlePublish.read_count,
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
      userId: req.user._id,
    });
    if (findBlog) {
      const updataToPublish = await BlogModel.updateOne(
        { _id: reqParam },
        {
          state: "published",
        }
      );
      logger.info("[Return Blog] =>  blog published");

      return res.status(200).json({
        massage: "Published",
        data: {
          updataToPublish,
        },
      });
    } else {
      logger.info("[Return Blog] => you can not published blog ");

      return res.status(401).json({
        massage: " Your not Authorised",
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
      userId: req.user._id,
    });
    if (findBlog) {
      const edithblog = await BlogModel.updateMany({ _id: reqParam }, reqBody);
      logger.info("[Return Blog] => blog edited ");

      return res.status(200).json({
        massage: "Edit completed",
        data: {
          edithblog,
        },
      });
    } else {
      logger.info("[Return Blog] => you can not edit blog");

      return res.status(401).json({
        massage: " Your not Authorised",
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
      userId: req.user._id,
    });
    if (findBlog) {
      const deleteblog = await BlogModel.deleteMany({ _id: reqParam });
      logger.info("[Return Blog] =>  blog deleted");

      return res.status(200).json({
        massage: "Blog Deleted",
        data: {
          deleteblog,
        },
      });
    } else {
      logger.info("[Return Blog] => you can not delete blog");

      return res.status(401).json({
        massage: " Your not Authorised",
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
    const qeuryObject = { userId: req.user._id };
    if (state) {
      qeuryObject.state = state === draft ? draft : published;
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    const blogs = await BlogModel.find(qeuryObject).skip(skip).limit(limit);
    return res.status(200).json({
      massage: "Own Blog List",
      data: {
        blogs,
      },
    });
  } catch (error) {
    return res.status(500).json({
      massage: error.massage,
    });
  }
};

const file_upload = async (req, res) => {
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);

    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    return res.json({
      data: cloudinaryResponse,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      massage: error.massage,
    });
  }
};

module.exports = {
  createBlog,
  getAllPublish,
  getAllBlogs,
  getOnePublished,
  publishOwnBlog,
  edithOwnBlog,
  deleteOwnBlog,
  getOwnBlog,
  file_upload,
};
