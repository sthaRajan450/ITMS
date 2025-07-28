const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const {
  bookDemo,
  getAvailableSlots,
  getAllScheduleDemo,
} = require("../controllers/demo.controller");

const demoRouter = express.Router();

demoRouter.post("/book", verifyToken, bookDemo);
demoRouter.get("/all", verifyToken, getAllScheduleDemo);
demoRouter.get("/slots/:courseId", getAvailableSlots); // No auth needed to see slots

module.exports = demoRouter;
