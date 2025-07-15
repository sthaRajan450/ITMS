const Job = require("../models/job.model");
const JobApplication = require("../models/jobApplication.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const uploadOnCloudinary = require("../utils/cloudinary");

const createJob = asyncHandler(async (req, res) => {
  const { title, company, location, salary, description } = req.body;

  if (!title || !company || !location || !salary || !description) {
    throw new ApiError(400, "All fields are required");
  }
  const existedJob = await Job.findOne({ $and: [{ title }, { company }] });
  if (existedJob) {
    throw new ApiError(400, "Job already exist");
  }

  const jobInstance = await Job.create({
    title,
    company,
    location,
    salary,
    description,
    postedBy: req.user._id,
  });

  const createdJob = await Job.findById(jobInstance._id);

  if (!createdJob) {
    throw new ApiError(404, "Job does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Job is created successfully", createdJob));
});

const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().populate("postedBy", "fullName email");
  if (jobs.length === 0) {
    throw new ApiError(404, "No jobs yet");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Jobs retrieved successfully", jobs));
});

const getJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const job = await Job.findById(jobId).populate("postedBy", "fullName email");
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  res.status(200).json(new ApiResponse(200, "Job retrieved successfully", job));
});

const removeJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const job = await Job.findByIdAndDelete(jobId);
  if (!job) {
    throw new ApiError(400, "Job not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Job deleted successfully", job));
});

const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { title, company, location, salary, description } = req.body;

  const job = await Job.findByIdAndUpdate(
    jobId,
    { title, company, location, salary, description },
    { new: true }
  );
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Job updated successfully", job));
});

const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { coverLetter } = req.body;

  const alreadyApplied = await JobApplication.findOne({
    job: jobId,
    applicant: req.user._id,
  });
  if (alreadyApplied) {
    throw new ApiError(400, "You have already applied for this job");
  }

  const resumeLocalPath = req.file.path;
  if (!resumeLocalPath) {
    throw new ApiError(400, "Resume file is required");
  }
  const resume = await uploadOnCloudinary(resumeLocalPath);
  if (!resume) {
    throw new ApiError(400, "Failed to upload resume  on cloudinary");
  }
  const application = await JobApplication.create({
    applicant: req.user._id,
    job: jobId,
    coverLetter: coverLetter || "",
    resume: resume.secure_url,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, "Applied successfully ", application));
});

const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await JobApplication.find({ applicant: req.user?._id })
    .populate("job", "title company salary")
    .sort({ createdAt: -1 });

  if (!applications.length) {
    throw new ApiError(404, "No job applications found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Applications fetched successfully", applications)
    );
});


const getAllApplications = asyncHandler(async (req, res) => {
  if (req.user?.role !== "Admin") {
    throw new ApiError(401, "Unauthorized request");
  }

  const applications = await JobApplication.find()
    .populate("applicant job")
    .sort({ createdAt: -1 });

  if (applications.length === 0) {
    throw new ApiError(404, "No job applications found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        applications,
        "All job applications fetched successfully"
      )
    );
});

const acceptApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  if (req.user?.role !== "Admin") {
    throw new ApiError(401, "Unauthorized request");
  }
  const application = await JobApplication.findById(applicationId);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  application.status = "Accepted";
  await application.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Application accepted successfully"));
});
const rejectApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  if (req.user?.role !== "Admin") {
    throw new ApiError(401, "Unauthorized request");
  }
  const application = await JobApplication.findById(applicationId);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  await JobApplication.findByIdAndDelete(applicationId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Application rejected successfully"));
});

module.exports = {
  createJob,
  getAllJobs,
  getJob,
  removeJob,
  updateJob,
  applyToJob,
  getMyApplications,
  getAllApplications,
  acceptApplication,
  rejectApplication,
};
