const Review = require("../models/review.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// ✅ Add a review (user)
const addReview = asyncHandler(async (req, res) => {
  const { userId, courseId, rating, comment } = req.body;

  if (!userId || !courseId || !rating) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required"));
  }

  await Review.create({
    user: userId,
    course: courseId,
    rating,
    comment,
    isApproved: false,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Review submitted for approval"));
});

// ✅ Get approved reviews of a course (public)
const getCourseReviews = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const reviews = await Review.find({ course: courseId, isApproved: true })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Reviews fetched successfully", reviews));
});

// ✅ Approve a review (admin)
const approveReview = asyncHandler(async (req, res) => {
  if (req.user?.role !== "Admin") {
    throw new ApiError(404, "Unauthorized request");
  }
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  review.isApproved = true;
  await review.save();

  res.status(200).json(new ApiResponse(200, "Review approved successfully"));
});

// ✅ Get all pending (unapproved) reviews (admin)
const getPendingReviews = asyncHandler(async (req, res) => {
  if (req.user?.role !== "Admin") {
    throw new ApiError(404, "Unauthorized request");
  }
  const reviews = await Review.find({ isApproved: false })
    .populate("user", "fullName")
    .populate("course", "title")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, "Pending reviews fetched", reviews));
});
const getAllApprovedReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ isApproved: true })
    .populate("user", "fullName avatar")
    .populate("course", "title")
    .sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, "All reviews fetched", reviews));
});

module.exports = {
  addReview,
  getCourseReviews,
  approveReview,
  getPendingReviews,
  getAllApprovedReviews,
};
