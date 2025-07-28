const Demo = require("../models/demo.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const bookDemo = asyncHandler(async (req, res) => {
  const { courseId, date, timeSlot } = req.body;
  const userId = req.user._id;

  const alreadyBooked = await Demo.findOne({
    userId,
    courseId,
    date,
    timeSlot,
  });

  if (alreadyBooked) {
    return res
      .status(409)
      .json(new ApiResponse(409, "You have already booked this slot"));
  }
  const slotTaken = await Demo.findOne({ courseId, date, timeSlot });

  if (slotTaken) {
    return res
      .status(409)
      .json(new ApiResponse(409, "This time slot is already booked."));
  }

  const booking = await Demo.create({
    userId,
    courseId,
    date,
    timeSlot,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Demo session booked successfully!", booking));
});
const ALL_SLOTS = ["10:00 AM", "2:00 PM", "4:00 PM"];

const getAvailableSlots = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Date query parameter is required"));
  }

  const bookings = await Demo.find({ courseId, date });
  const bookedSlots = bookings.map((b) => b.timeSlot);

  const availableSlots = ALL_SLOTS.filter(
    (slot) => !bookedSlots.includes(slot)
  );

  return res.status(200).json(
    new ApiResponse(200, "Available slots fetched successfully", {
      availableSlots,
    })
  );
});

const getAllScheduleDemo = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin") {
    throw new ApiError(402, "Unauthorized request");
  }
  const demos = await Demo.find().populate(
    "userId courseId",
    "fullName email title"
  );
  if (!demos) {
    throw new ApiError(404, "Demos not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, "All schedule demos are fetched successfully", demos)
    );
});

module.exports = { bookDemo, getAvailableSlots, getAllScheduleDemo };
