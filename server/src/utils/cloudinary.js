const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    const fileExt = path.extname(localFilePath).toLowerCase();

    let resourceType = "image";

    if ([".pdf", ".doc", ".docx", ".ppt", ".zip"].includes(fileExt)) {
      resourceType = "raw";
    } else if ([".mp4", ".mov", ".avi"].includes(fileExt)) {
      resourceType = "video";
    } else {
      resourceType = "auto";
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
    });

    console.log(
      "File is successfully uploaded to cloudinary",
      response.secure_url
    );

    try {
      fs.unlinkSync(localFilePath);
    } catch (unlinkErr) {
      console.error("Failed to delete local file after upload:", unlinkErr);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);

    try {
      fs.unlinkSync(localFilePath);
    } catch (unlinkErr) {
      console.error(
        "Failed to delete local file after upload failure:",
        unlinkErr
      );
    }

    return null;
  }
};

module.exports = uploadOnCloudinary;
