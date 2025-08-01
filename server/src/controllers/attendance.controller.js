const mongoose = require("mongoose");
const Attendance = require("../models/attendance.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// Mark Attendance
const markAttendance = asyncHandler(async (req, res) => {
  const { studentId, courseId, date, status, remarks } = req.body;

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const alreadyMarked = await Attendance.findOne({
    student: studentId,
    course: courseId,
    date: { $gte: dayStart, $lte: dayEnd },
  });

  if (alreadyMarked) {
    throw new ApiError(
      400,
      "Attendance already marked for this student on this date."
    );
  }

  const attendance = await Attendance.create({
    student: studentId,
    date,
    status,
    course: courseId,
    remarks,
    createdBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Attendance marked successfully", attendance));
});

// Get Student Attendance (with course title)
const getStudentAttendance = asyncHandler(async (req, res) => {
  const studentId = req.params.studentId;

  const records = await Attendance.find({ student: studentId })
    .populate("course", "title")
    .sort({ date: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Student attendance fetched successfully", records)
    );
});

// Get Attendance Report (range query)
const getAttendanceReport = asyncHandler(async (req, res) => {
  const { from, to, courseId, studentId } = req.query;

  const filter = {
    date: { $gte: from, $lte: to }, // use string comparison for "YYYY-MM-DD"
  };

  if (courseId) {
    filter.course = courseId;
  }

  if (studentId) {
    filter.student = studentId;
  }

  const report = await Attendance.find(filter)
    .populate("student", "fullName email")
    .populate("course", "title");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Student attendance report fetched successfully",
        report
      )
    );
});

// Get Attendance by Course and Date
const getAttendanceByCourseAndDate = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const date = req.query.date;
  console.log(courseId, date);

  if (!courseId || !date) {
    throw new ApiError(400, "Course ID and date are required");
  }

  const attendanceRecords = await Attendance.find({
    course: courseId,
    date: date,
  }).populate("student", "fullName email");

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Attendance fetched successfully", attendanceRecords)
    );
});

// Get Attendance Summary (count by status)
const getAttendanceSummary = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const summary = await Attendance.aggregate([
    {
      $match: {
        student: new mongoose.Types.ObjectId(studentId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Attendance summary fetched successfully", summary)
    );
});

const updateAttendanceStatus = asyncHandler(async (req, res) => {
  const attendanceId = req.params.attendanceId;
  const { status, remarks } = req.body;

  if (!["Present", "Absent"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) throw new ApiError(404, "Attendance record not found");

  attendance.status = status;
  if (remarks !== undefined) attendance.remarks = remarks;

  await attendance.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Attendance updated", attendance));
});
module.exports = {
  markAttendance,
  getStudentAttendance,
  getAttendanceReport,
  getAttendanceByCourseAndDate,
  getAttendanceSummary,
  updateAttendanceStatus,
};
