const express = require("express");
const userRouter = require("./users/userRouter");
const bodyParser = require("body-parser");
const blogRouter = require("./blogs/blogsRouter");
const view_router = require("./views/viewRouter");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const cors = require("cors");
//
require("dotenv").config();
const cloudinary = require("./integegration/cloudinary");
const fs = require("fs");

const app = express();

const swaggerDocument = YAML.load("./swagger.yaml");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));
app.set("view engine", "ejs");
app.use("/views", view_router);
app.use("/v1", userRouter);
//v1/user/login
//v1/user/signup
app.use("/v1", blogRouter);
//v1/allBlog
app.get("/", (req, res) => {
  res.send('<h1> Welcome to Blog API</h1><a href="/api_doc">Documentation</a>');
});
app.use("/api_doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// app.post('/photos', upload.single('file'), async (req, res, next) => {
// 	const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
// 	fs.unlink(req.file.path, (err) => {
// 		if (err) {
// 			console.error(err);
// 			return;
// 		}
// 	});
// 	return res.json({
// 		data: cloudinaryResponse,
// 		error: null,
// 	});
// });
//v1/allBlog?author=author
//v1/allBlog?tags=tags
//v1/allBlog?title=title
//v1/allBlog?order=read_count
//v1/allBlog?order=read_time
//v1/allBlog?order=timestamps
//v1/singleBlog/:id
//v1/publishedBlog/:id
//v1/edith/:id
//v1/deleteBlog/:id
//v1/ownblog
// app.get('/', (req, res) => {
// 	res.send('you are to my blog app');
// });
app.get("*", (req, res) => {
  return res.status(404).json({
    data: null,
    error: "Route not found",
  });
});
module.exports = app;
