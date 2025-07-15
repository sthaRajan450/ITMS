const express = require("express");
const {
  createOrder,
  getOrder,
  getAllOrders,
  success,
} = require("../controllers/order.controller");
const verifyToken = require("../middlewares/auth.middleware");

const orderRouter = express.Router();

orderRouter.route("/create").post(verifyToken, createOrder);
orderRouter.route("/success").get(success);
orderRouter.route("/all").get(getAllOrders);
orderRouter.route("/:orderId").get(getOrder);

module.exports = orderRouter;
