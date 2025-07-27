const express = require("express");
const {
  addReview,
  getCourseReviews,
  approveReview,
  getPendingReviews,
  getAllApprovedReviews,
} = require("../controllers/review.controller");
const verifyToken = require("../middlewares/auth.middleware");

const reviewRouter = express.Router();

// Public route - add review (user must be authenticated)
reviewRouter.post("/add", verifyToken, addReview);

reviewRouter.get("/all", getAllApprovedReviews);

// Admin route - get pending (unapproved) reviews
reviewRouter.get("/pending", verifyToken, getPendingReviews);

// Public route - get approved reviews of a course
reviewRouter.get("/:courseId", getCourseReviews);

// Admin route - approve a review
reviewRouter.put("/approve/:id", verifyToken, approveReview);

module.exports = reviewRouter;
