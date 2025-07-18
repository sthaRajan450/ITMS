const Order = require("../models/order.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const course = req.body;

  if (!userId || !course) {
    throw new ApiError(400, "User ID and course details are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const order = await Order.create({
    user: userId,
    course,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Order created successfully", order));
});

// Fetch all orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user course.course_id", "name email title price duration")
    .sort({ createdAt: -1 });

  if (!orders.length) {
    throw new ApiError(404, "No orders found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Orders fetched successfully", orders));
});

// Fetch single order by ID
const getOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate("user", "name email");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Order fetched successfully", order));
});

const success = asyncHandler(async (req, res) => {
  let data = req.query.data;
  data = JSON.parse(atob(data));
  console.log(data);

  let order = await Order.findOne({ _id: data.transaction_uuid });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  await Order.findByIdAndUpdate(
    data.transaction_uuid,
    { paymentStatus: data.status },
    {
      new: true,
    }
  );

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  return res.redirect(`${clientUrl}/success/${data.transaction_uuid}`);
});

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  success,
};
