const Assignment = require("../models/assignment.model");
const AssignmentSubmission = require("../models/assignmentSubmission.model");
const Course = require("../models/course.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const uploadOnCloudinary = require("../utils/cloudinary");

const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, deadline, courseId } = req.body;

  let fileUrl = "";
  if (req.file) {
    const uploadedFile = await uploadOnCloudinary(req.file.path);
    if (!uploadedFile)
      throw new ApiError(400, "Failed to upload assignment file");
    fileUrl = uploadedFile.secure_url;
  }

  const assignment = await Assignment.create({
    course: courseId,
    title,
    description,
    deadline,
    fileUrl,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, "Assignment created", assignment));
});
const getAssignmentByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const assignments = await Assignment.find({ course: courseId });
  if (!assignments.length) {
    throw new ApiError(404, "No assignments found for this course");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Assignments fetched successfully", assignments)
    );
});

const submitAssignment = asyncHandler(async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.file", req.file);

  const assignmentId = req.body.assignmentId;
  const courseId = req.body.courseId;
  const comment = req.body.comment;

  if (!assignmentId || !courseId) {
    throw new ApiError(400, "assignmentId and courseId are required");
  }

  const filePath = req.file.path;

  const uploadedFile = await uploadOnCloudinary(filePath);
  if (!uploadedFile) throw new ApiError(400, "Failed to upload submission");

  const submission = await AssignmentSubmission.create({
    assignment: assignmentId,
    course: courseId,
    student: req.user._id,
    submittedFile: uploadedFile.secure_url,
    comment,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, "Assignment submitted successfully", submission)
    );
});

const getSubmittedAssignments = asyncHandler(async (req, res) => {
  const assignments = await AssignmentSubmission.find({
    student: req.user._id,
  }).populate("course");

  if (assignments.length === 0) {
    throw new ApiError(404, "No submitted assignments found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Submitted assignments fetched successfully",
        assignments
      )
    );
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const assignment = await Assignment.findByIdAndDelete(assignmentId);
  if (!assignment) {
    throw new ApiError(404, "No assignment found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Assignment deleted successfully"));
});

const getSubmittedAssignmentsForInstructor = asyncHandler(async (req, res) => {
  //  Find all courses taught by this instructor
  const instructorId = req.user._id;
  const courses = await Course.find({ instructor: instructorId }).select("_id");

  if (courses.length === 0) {
    throw new ApiError(404, "No courses found for this instructor.");
  }

  const courseIds = courses.map((course) => course._id);

  //  Find all assignment submissions for these courses
  const submissions = await AssignmentSubmission.find({
    course: { $in: courseIds },
  })
    .populate("student", "fullName email") // populate student info, adjust fields as needed
    .populate("assignment", "title deadline") // populate assignment info
    .populate("course", "title") // populate course info
    .exec();

  if (submissions.length === 0) {
    throw new ApiError(404, "No assignments submitted for your course");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Submitted assignments fetched successfully",
        submissions
      )
    );
});

module.exports = {
  createAssignment,
  getAssignmentByCourse,
  submitAssignment,
  getSubmittedAssignments,
  deleteAssignment,
  getSubmittedAssignmentsForInstructor,
};
