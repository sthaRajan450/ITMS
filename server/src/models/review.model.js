const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
