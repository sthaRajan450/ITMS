const Resource = require("../models/resource.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const uploadOnCloudinary = require("../utils/cloudinary");

const uploadResource = asyncHandler(async (req, res) => {
  const { title, courseId, type, link } = req.body;

  if (!title || !courseId || !type) {
    throw new ApiError(400, "Title, courseId, and type are required");
  }

  let fileUrl = null;

  // Handle file upload
  if (type === "file") {
    if (!req.file || !req.file.path) {
      throw new ApiError(400, "File not provided");
    }

    const uploadedFile = await uploadOnCloudinary(req.file.path);

    if (!uploadedFile) {
      throw new ApiError(400, "Failed to upload file to Cloudinary");
    }

    fileUrl = uploadedFile.secure_url;
  }

  // Handle link validation
  if (type === "link") {
    if (!link) throw new ApiError(400, "Link is required for link type");
  }

  const resource = await Resource.create({
    course: courseId,
    title,
    type,
    fileUrl: type === "file" ? fileUrl : undefined,
    link: type === "link" ? link : undefined,
    uploadedBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, "Resource uploaded", resource));
});


const getResourcesByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const resources = await Resource.find({ course: courseId });
  if (!resources.length) {
    throw new ApiError(404, "No resources found for this course");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Resources fetched successfully", resources));
});

const deleteResource = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;

  const resource = await Resource.findById(resourceId);
  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  if (
    req.user.role !== "Instructor" ||
    !resource.uploadedBy.equals(req.user._id)
  ) {
    throw new ApiError(401, "Unauthorized");
  }

  await resource.deleteOne();

  res.status(200).json(new ApiResponse(200, "Resource deleted successfully"));
});



module.exports = {
  uploadResource,
  getResourcesByCourse,
  deleteResource,
};
