const Blog = require("../models/blog.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const uploadOnCloudinary = require("../utils/cloudinary");

const createBlog = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    throw new ApiError(400, "All fields are required");
  }
  const existedBlog = await Blog.findOne({ title });
  if (existedBlog) {
    throw new ApiError(400, "Blog already exist");
  }

  const blogImagePath = req.file.path;
  console.log(blogImagePath);

  if (!blogImagePath) {
    throw new ApiError(400, "Image file is required");
  }
  const image = await uploadOnCloudinary(blogImagePath);
  console.log(image);

  const blogInstance = await Blog.create({
    title,
    content,
    category,
    image: image.secure_url,
    author: req.user._id,
  });

  const createdBlog = await Blog.findById(blogInstance._id);

  if (!createdBlog) {
    throw new ApiError(404, "Blog does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Blog is created successfully", createdBlog));
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().populate("author", "fullName email");
  if (blogs.length === 0) {
    throw new ApiError(404, "No blogs yet");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Blogs retrieved successfully", blogs));
});

const getBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId).populate("author", "fullName email");
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Blog retrieved successfully", blog));
});

const updateBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { title, category, content } = req.body;

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  let newImage;
  const newImagePath = req.file?.path;

  if (newImagePath) {
    newImage = await uploadOnCloudinary(newImagePath);
    if (!newImage) {
      throw new ApiError(400, "Failed to upload new image");
    }
  }

  blog.title = title || blog.title;
  blog.category = category || blog.category;
  blog.content = content || blog.content;
  blog.image = newImage?.secure_url || blog.image;

  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse(200,  "Blog updated successfully",blog));
});

const removeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findByIdAndDelete(blogId);
  if (!blog) {
    throw new ApiError(400, "Blog not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Blog deleted successfully", blog));
});
module.exports = { createBlog, getAllBlogs, getBlog, updateBlog, removeBlog };
