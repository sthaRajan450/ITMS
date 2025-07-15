const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const {
  uploadResource,
  getResourcesByCourse,
  deleteResource,
} = require("../controllers/resource.controller");

const resourceRouter = express.Router();

resourceRouter
  .route("/upload")
  .post(verifyToken, upload.single("file"), uploadResource);

resourceRouter
  .route("/course/:courseId")
  .get(verifyToken, getResourcesByCourse);

resourceRouter.route("/delete/:resourceId").delete(verifyToken, deleteResource);

module.exports = resourceRouter;
