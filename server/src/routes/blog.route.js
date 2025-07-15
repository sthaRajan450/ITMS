const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  removeBlog,
} = require("../controllers/blog.controller");
const upload = require("../middlewares/upload.middleware");
const verifyToken = require("../middlewares/auth.middleware");
const blogRouter = express.Router();

blogRouter
  .route("/create")
  .post(verifyToken, upload.single("image"), createBlog);
blogRouter.route("/all").get(getAllBlogs);
blogRouter.route("/:blogId").get(verifyToken, getBlog);
blogRouter.route("/:blogId").put(upload.single("image"), updateBlog);
blogRouter.route("/:blogId").delete(verifyToken, removeBlog);
module.exports = blogRouter;
