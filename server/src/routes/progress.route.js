const express = require("express");

const verifyToken = require("../middlewares/auth.middleware");
const {
  getStudentProgress,
  getMyProgress,
} = require("../controllers/progress.controller");
const progressRouter = express.Router();

progressRouter.route("/my/:courseId").get(verifyToken, getMyProgress);
progressRouter.route("/:courseId/:studentId").get(getStudentProgress);

module.exports = progressRouter;
