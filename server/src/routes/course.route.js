const express = require("express");
const {
  createCourse,
  getAllCourses,
  getCourse,
  enrollCourse,
  getMyCourses,
  removeCourse,
  updateCourse,
  addCourse,
} = require("../controllers/course.controller");
const upload = require("../middlewares/upload.middleware");
const verifyToken = require("../middlewares/auth.middleware");

const courseRouter = express.Router();

// Admin-only course creation
courseRouter
  .route("/admin/create")
  .post(verifyToken, upload.single("thumbnail"), addCourse);

// General course creation
courseRouter
  .route("/create")
  .post(verifyToken, upload.single("thumbnail"), createCourse);

// Fetch all courses
courseRouter.route("/getAllCourses").get(getAllCourses);

// Enroll in a course
courseRouter.route("/enroll/:courseId").post(verifyToken, enrollCourse);

// Fetch my enrolled courses (must be before any /:param routes)
courseRouter.route("/getMyCourses").get(verifyToken, getMyCourses);

// Delete a course
courseRouter.route("/delete/:courseId").delete(verifyToken, removeCourse);

// Update a course
courseRouter
  .route("/update/:courseId")
  .put(verifyToken, upload.single("thumbnail"), updateCourse);

// Fetch a single course by ID
courseRouter.route("/:courseId").get(getCourse);

module.exports = courseRouter;
