const Course = require("../models/course.model");
const User = require("../models/user.model");

const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const uploadOnCloudinary = require("../utils/cloudinary");
const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    syllabus,
    duration,
    price,
    level,
    category,
    prerequisites,
    enrollmentDeadline,
  } = req.body;

  if (
    !title ||
    !description ||
    !syllabus ||
    !duration ||
    !price ||
    !level ||
    !category ||
    !enrollmentDeadline
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const course = await Course.findOne({ title });
  if (course) {
    throw new ApiError(400, "Course already exist");
  }

  const thumbnailLocalPath = req.file?.path;
  console.log(thumbnailLocalPath);
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  console.log(thumbnail);
  if (!thumbnail) {
    throw new ApiError(400, "Failed to upload file on cloudinary");
  }

  let parsedSyllabus;
  try {
    parsedSyllabus =
      typeof syllabus === "string" ? JSON.parse(syllabus) : syllabus;
    if (!Array.isArray(parsedSyllabus)) {
      throw new Error();
    }
  } catch (error) {
    throw new ApiError(
      400,
      "Invalid syllabus format — must be an array or valid JSON array"
    );
  }

  const courseInstance = await Course.create({
    title,
    description,
    syllabus: parsedSyllabus,
    duration,
    price,
    level,
    category,
    thumbnail: thumbnail.secure_url,
    prerequisites,
    enrollmentDeadline,
    instructor: req.user._id,
  });

  const createdCourse = await Course.findById(courseInstance._id);

  if (!createdCourse) {
    throw new ApiError(400, "Something went wrong while creating course");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Course created successfully", createdCourse));
});

const addCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    syllabus,
    duration,
    price,
    level,
    category,
    prerequisites,
    enrollmentDeadline,
    instructor,
  } = req.body;

  if (
    !title ||
    !description ||
    !syllabus ||
    !duration ||
    !price ||
    !level ||
    !category ||
    !enrollmentDeadline ||
    !instructor
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const course = await Course.findOne({ title });
  if (course) {
    throw new ApiError(400, "Course already exist");
  }

  const thumbnailLocalPath = req.file?.path;
  console.log(thumbnailLocalPath);
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  console.log(thumbnail);
  if (!thumbnail) {
    throw new ApiError(500, "Failed to upload file on cloudinary");
  }

  let parsedSyllabus;
  try {
    parsedSyllabus =
      typeof syllabus === "string" ? JSON.parse(syllabus) : syllabus;
    if (!Array.isArray(parsedSyllabus)) {
      throw new Error();
    }
  } catch (error) {
    throw new ApiError(
      400,
      "Invalid syllabus format — must be an array or valid JSON array"
    );
  }

  const courseInstance = await Course.create({
    title,
    description,
    syllabus: parsedSyllabus,
    duration,
    price,
    level,
    category,
    thumbnail: thumbnail.secure_url,
    prerequisites,
    enrollmentDeadline,
    instructor,
  });

  const createdCourse = await Course.findById(courseInstance._id);

  if (!createdCourse) {
    throw new ApiError(400, "Something went wrong while adding course");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Course added successfully", createdCourse));
});

const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().select("-instructor");
  if (!courses.length) {
    throw new ApiError(404, "Courses not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, "All courses are retrieved successfully", courses)
    );
});

const getCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId).populate("instructor");
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Course is retrieved successfully", course));
});

const enrollCourse = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const user = await User.findById(userId);

  if (user.enrolledCourses.includes(courseId)) {
    throw new ApiError(400, "You are already enrolled in this course");
  }

  user.enrolledCourses.push(courseId);
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully enrolled in a course"));
});

const getMyCourses = asyncHandler(async (req, res) => {
  if (req.user?.role === "Student") {
    const user = await User.findById(req.user._id).populate("enrolledCourses");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "My enrolled courses fetched successfully",
          user.enrolledCourses
        )
      );
  }

  if (req.user?.role === "Instructor") {
    const courses = await Course.find({ instructor: req.user._id });

    if (!courses.length) {
      throw new ApiError(404, "No courses found for this instructor");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Your courses fetched successfully", courses));
  }

  throw new ApiError(403, "Unauthorized access to this resource");
});

const removeCourse = asyncHandler(async (req, res) => {
  if (!["Admin", "Instructor"].includes(req.user?.role)) {
    throw new ApiError(401, "Unauthorized request");
  }
  const { courseId } = req.params;

  const course = await Course.findByIdAndDelete(courseId);
  if (!course) {
    throw new ApiError(400, "Failed to delete course");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Course deleted successfully", course));
});

const updateCourse = asyncHandler(async (req, res) => {
  if (!["Admin", "Instructor"].includes(req.user?.role)) {
    throw new ApiError(401, "Unauthorized request");
  }

  const { courseId } = req.params;
  const {
    title,
    description,
    syllabus,
    duration,
    price,
    level,
    category,
    prerequisites,
    enrollmentDeadline,
    instructor,
  } = req.body;

  if (
    !title ||
    !description ||
    !syllabus ||
    !duration ||
    !price ||
    !level ||
    !category ||
    !enrollmentDeadline
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const thumbnailLocalPath = req.file?.path;
  console.log(thumbnailLocalPath);
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  console.log(thumbnail);
  if (!thumbnail) {
    throw new ApiError(400, "Failed to upload file on cloudinary");
  }

  let parsedSyllabus;
  try {
    parsedSyllabus =
      typeof syllabus === "string" ? JSON.parse(syllabus) : syllabus;
    if (!Array.isArray(parsedSyllabus)) {
      throw new Error();
    }
  } catch (error) {
    throw new ApiError(
      400,
      "Invalid syllabus format — must be an array or valid JSON array"
    );
  }

  const courseInstance = await Course.findByIdAndUpdate(courseId, {
    title,
    description,
    syllabus: parsedSyllabus,
    duration,
    price,
    level,
    category,
    thumbnail: thumbnail.secure_url,
    prerequisites,
    enrollmentDeadline,
    instructor: instructor,
  });

  const createdCourse = await Course.findById(courseInstance._id);

  if (!createdCourse) {
    throw new ApiError(400, "Something went wrong while updating course");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Course updated successfully", createdCourse));
});
module.exports = {
  createCourse,
  getAllCourses,
  getCourse,
  enrollCourse,
  getMyCourses,
  removeCourse,
  updateCourse,
  addCourse,
};
