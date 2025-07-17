const Course = require("../models/course.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const uploadOnCloudinary = require("../utils/cloudinary");

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  if (!fullName || !email || !password || !phone) {
    throw new ApiError(400, "All fields are required");
  }

  const isExist = await User.findOne({ email });
  if (isExist) {
    throw new ApiError(401, "User already exist");
  }

  const avatarLocalPath = req.file?.path;
  // console.log(avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  // console.log(avatar);
  if (!avatar) {
    throw new ApiError(400, "Failed to upload file on cloudinary");
  }

  const userInstance = await User.create({
    fullName,
    email,
    password,
    phone,
    avatar: avatar.secure_url,
  });

  const createdUser = await User.findById(userInstance._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(404, "Something went wrong while registering user");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    createdUser._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist ");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, "Incorrect password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    samesite: "None", // Adjust based on your deployment
  };

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(200)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out ", {}));
});

const getUserById = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin") {
    throw new ApiError(401, "Unauthorized request");
  }
  const { userId } = req.params;
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json(new ApiResponse(200, "User profile fetched", user));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const role = req.user.role;

  if (!["Instructor", "Admin"].includes(role)) {
    throw new ApiError(403, "You are not authorized to access this resource");
  }

  // Instructor role logic
  if (role === "Instructor") {
    const courses = await Course.find({ instructor: req.user._id });

    if (!courses.length) {
      throw new ApiError(404, "No courses found for this instructor");
    }

    const courseIds = courses.map((course) => course._id);

    const students = await User.find({
      role: "Student",
      enrolledCourses: { $in: courseIds },
    }).select("fullName email phone avatar enrolledCourses");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          students.length
            ? "Students fetched successfully"
            : "No students enrolled in your courses yet",
          students
        )
      );
  }

  // Admin role logic
  if (role === "Admin") {
    const users = await User.find().select("-password");

    if (!users.length) {
      throw new ApiError(400, "No users exist");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "All users fetched successfully", users));
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { fullName, email, phone, role } = req.body;

  if (req.user.role !== "Admin") {
    throw new ApiError(401, "Unauthorized request");
  }

  const updateData = { fullName, email, phone, role };

  if (req.file?.path) {
    const avatar = await uploadOnCloudinary(req.file.path);
    if (!avatar) {
      throw new ApiError(400, "Failed to upload avatar to Cloudinary");
    }
    updateData.avatar = avatar.secure_url;
  }

  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

  if (!user) {
    throw new ApiError(400, "Failed to update user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User updated successfully", user));
});

const addUser = asyncHandler(async (req, res) => {
  if (req.user?.role !== "Admin") {
    throw new ApiError(401, "Unauthorized request");
    return;
  }
  const { fullName, email, password, phone, role } = req.body;

  if (!fullName || !email || !password || !phone) {
    throw new ApiError(400, "All fields are required");
  }

  const isExist = await User.findOne({ email });
  if (isExist) {
    throw new ApiError(401, "User already exist");
  }

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Failed to upload file on cloudinary");
  }

  const userInstance = await User.create({
    fullName,
    email,
    password,
    phone,
    role,
    avatar: avatar.secure_url,
  });

  const createdUser = await User.findById(userInstance._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(404, "Something went wrong while adding user");
  }

  return res

    .status(201)
    .json(new ApiResponse(201, "User added successfully", createdUser));
});
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (req.user?.role !== "Admin") {
    throw new ApiError(400, "Unauthorized request");
  }
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully", user));
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  addUser,
};
