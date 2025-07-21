const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const {
  createAssignment,
  getAssignmentByCourse,
  submitAssignment,
  getSubmittedAssignments,
  deleteAssignment,
  getSubmittedAssignmentsForInstructor,
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
  .route("/instructor/submittedAssignments")
  .get(verifyToken, getSubmittedAssignmentsForInstructor);
assignmentRouter
  .route("/submitted/all")
  .get(verifyToken, getSubmittedAssignments);
assignmentRouter
  .route("/course/:courseId")
  .get(verifyToken, getAssignmentByCourse);
assignmentRouter.route("/:assignmentId").delete(verifyToken, deleteAssignment);
module.exports = assignmentRouter;
