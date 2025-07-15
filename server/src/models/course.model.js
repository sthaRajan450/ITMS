const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    syllabus: [
      {
        type: String,
        required: true,
      },
    ],
    duration: {
      type: String,
      required: [true, "Course duration is required"],
    },
    price: {
      type: Number,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    category: {
      type: String,
      required: [true, "Course category is required"],
    },
    prerequisites: {
      type: String,
      default: "No prerequisites required",
    },
    enrollmentDeadline: {
      type: Date,
      required: [true, "Enrollment deadline is required"],
    },
    thumbnail: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
