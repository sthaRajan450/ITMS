const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const {
  markAttendance,
  getStudentAttendance,
  getAttendanceReport,
  getAttendanceByCourseAndDate,
  getAttendanceSummary,
  updateAttendanceStatus, // ✅ NEW
} = require("../controllers/attendance.controller");

const attendanceRouter = express.Router();

// ✅ Mark attendance
attendanceRouter.route("/mark").post(verifyToken, markAttendance);

// ✅ Get a student's full attendance records
attendanceRouter.route("/:studentId").get(verifyToken, getStudentAttendance);

// ✅ Get attendance report between date range
attendanceRouter.route("/report/all").get( getAttendanceReport);

// ✅ Get attendance by course and date
attendanceRouter
  .route("/course/:courseId")
  .get(verifyToken, getAttendanceByCourseAndDate);

// ✅ NEW: Get attendance summary by student
attendanceRouter
  .route("/summary/:studentId")
  .get(verifyToken, getAttendanceSummary);

attendanceRouter
  .route("/:attendanceId")
  .patch(verifyToken, updateAttendanceStatus);
module.exports = attendanceRouter;
