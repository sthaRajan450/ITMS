const mongoose = require("mongoose");
const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submittedFile: { type: String, required: true },
    comment: { type: String },
    status: {
      type: String,
      enum: ["Submitted", "Reviewed"],
      default: "Submitted",
    },
    instructorFeedback: {
      type: String,
    },
  },
  { timestamps: true }
);

const AssignmentSubmission = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);
module.exports = AssignmentSubmission;
