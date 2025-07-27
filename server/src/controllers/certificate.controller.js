const Certificate = require("../models/certificate.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const uploadOnCloudinary = require("../utils/cloudinary");

// Assign certificate to student (admin only)
const assignCertificate = asyncHandler(async (req, res) => {
  const { studentId, courseId, title, description } = req.body;

  // Read uploaded file
  const certificateLocalPath = req.file?.path;
  if (!certificateLocalPath) {
    throw new ApiError(400, "Certificate file is required");
  }
  const certificate = await uploadOnCloudinary(certificateLocalPath);
  if (!certificate) {
    throw new ApiError(500, "Failed to upload file on Cloudinary");
  }
  const cert = new Certificate({
    student: studentId,
    course: courseId,
    title,
    description,
    certificateUrl: certificate.secure_url,
  });

  await cert.save();

  return res
    .status(201)
    .json(new ApiResponse(201, "Certificate assigned successfully"));
});

// Get certificates for logged-in student
const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ student: req.user._id })
    .populate("course", "title")

    .exec();

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Certificates fetched successfully", certificates)
    );
});

// Optional: Get all certificates (admin)
const getAllCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find()
    .populate("student", "name email")
    .populate("course", "title")
    .exec();

  if (certificates.length == 0) {
    throw new ApiError(404, "Certificates not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "All cerficates fetched successfully"));
});
module.exports = { assignCertificate, getAllCertificates, getMyCertificates };
