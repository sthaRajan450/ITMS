const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    status: { type: String, enum: ["Present", "Absent"], required: true },
    date: { type: String, required: true }, // Keep as String if your app uses YYYY-MM-DD
    remarks: { type: String },
  },
  { timestamps: true }
);

//  Updated unique index: (student, course, date)
attendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
