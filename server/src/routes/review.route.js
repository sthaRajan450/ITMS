const express = require("express");
const {
  addReview,
  getCourseReviews,
  approveReview,
} = require("../controllers/review.controller");

const reveiewRouter = express.Router();

reveiewRouter.route("/add").post(addReview);
reveiewRouter.route("/:courseId").get(getCourseReviews);
reveiewRouter.route("/approve/:id").put(approveReview);
module.exports = reveiewRouter;
