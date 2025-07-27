const Review = require("../models/review.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const addReview = asyncHandler(async (req, res) => {
  const { userId, courseId, rating, comment } = req.body;

  if (!userId || !courseId || !rating) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required"));
  }

  const review = await Review.create({
    user: userId,
    course: courseId,
    rating,
    comment,
    isApproved: false,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, "Review added successfully"));
});

const getCourseReviews = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const reviews = await Review.find({ course: courseId, isApproved: true })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Reviews fetched successfully", reviews));
});

const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new ApiError(404, "Reveiew not found");
  }
  review.isApproved = true;
  await review.save();

  res.status(200).json(new ApiResponse(200, "Review approved succesfully"));
});

module.exports = { addReview, getCourseReviews, approveReview };
