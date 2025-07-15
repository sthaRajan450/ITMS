const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const {
  createAssignment,
  getAssignmentByCourse,
  submitAssignment,
  getSubmittedAssignments,
} = require("../controllers/assignment.controller");
const upload = require("../middlewares/upload.middleware");

const assignmentRouter = express.Router();
assignmentRouter
  .route("/create")
  .post(verifyToken, upload.single("file"), createAssignment);
assignmentRouter
  .route("/submit")
  .post(verifyToken, upload.single("file"), submitAssignment);
assignmentRouter
  .route("/submitted/all")
  .get(verifyToken, getSubmittedAssignments);
assignmentRouter
  .route("/course/:courseId")
  .get(verifyToken, getAssignmentByCourse);

module.exports = assignmentRouter;
