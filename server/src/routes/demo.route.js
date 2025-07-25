const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const { bookDemo, getAvailableSlots } = require("../controllers/demo.controller");

const demoRouter = express.Router();

demoRouter.get("/slots/:courseId", getAvailableSlots); // No auth needed to see slots
demoRouter.post("/book", verifyToken, bookDemo);

module.exports = demoRouter;
