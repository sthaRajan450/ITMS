const express = require("express");
const {
  removeJob,
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  applyToJob,
  getMyApplications,
  acceptApplication,
  rejectApplication,
  getAllApplications,
} = require("../controllers/job.controller");
const verifyToken = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const jobRouter = express.Router();

// static routes FIRST
jobRouter.route("/create").post(verifyToken, createJob);
jobRouter.route("/all").get(getAllJobs);
jobRouter.route("/apply/:jobId").post(
  verifyToken,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  applyToJob
);
jobRouter.route("/myApplications").get(verifyToken, getMyApplications);
jobRouter.route("/applications").get(verifyToken, getAllApplications);
jobRouter
  .route("/application/accept/:applicationId")
  .post(verifyToken, acceptApplication);
jobRouter
  .route("/application/reject/:applicationId")
  .post(verifyToken, rejectApplication);

// dynamic :jobId routes AFTER static ones
jobRouter.route("/:jobId").get(getJob);
jobRouter.route("/:jobId").put(verifyToken, updateJob);
jobRouter.route("/:jobId").delete(verifyToken, removeJob);

module.exports = jobRouter;
