const Message = require("../models/message.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");


const sendMessage = asyncHandler(async (req, res) => {
  const { receiver, course, message } = req.body;

  if (!receiver || !message) {
    throw new ApiError(400, "Receiver and message text are required");
  }

  const newMessage = await Message.create({
    sender: req.user._id,
    receiver,
    course,
    message,
  });

  res.status(201).json(
    new ApiResponse(201, "Message sent successfully", newMessage)
  );
});


const getUserMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const messages = await Message.find({ receiver: userId })
    .populate("sender", "fullName email")
    .populate("course", "title")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, "Messages retrieved successfully", messages));
});

module.exports = { sendMessage, getUserMessages };
