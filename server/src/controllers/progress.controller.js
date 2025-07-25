const Assignment = require("../models/assignment.model");
const AssignmentSubmission = require("../models/assignmentSubmission.model");
const Course = require("../models/course.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getStudentProgress = asyncHandler(async (req, res) => {
  const { courseId, studentId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const student = await User.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (!student.enrolledCourses.includes(courseId)) {
    throw new ApiError(403, "Student not enrolled in this course");
  }

  const assignments = await Assignment.find({ course: courseId });

  const submissions = await AssignmentSubmission.find({
    course: courseId,
    student: studentId,
  });

  const progress = assignments.map((assignment) => {
    const submitted = submissions.find(
      (sub) => sub.assignment.toString() === assignment._id.toString()
    );
    return {
      submissionId:submitted._id,
      assignmentTitle: assignment.title,
      submitted: !!submitted,
      submittedAt: submitted?.createdAt || null,
      status: submitted?.status || "Not Submitted",
    };
  });

  res.status(200).json(
    new ApiResponse(200, "Student progress fetched", {
      student: {
        fullName: student.fullName,
        email: student.email,
      },
      course: {
        title: course.title,
      },
      progress,
    })
  );
});



module.exports = { getStudentProgress };
