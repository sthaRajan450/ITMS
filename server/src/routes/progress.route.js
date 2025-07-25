const express = require("express");

const verifyToken = require("../middlewares/auth.middleware");
const { getStudentProgress } = require("../controllers/progress.controller");
const progressRouter = express.Router();

progressRouter
  .route("/:courseId/:studentId")
  .get(verifyToken, getStudentProgress);

module.exports = progressRouter;
