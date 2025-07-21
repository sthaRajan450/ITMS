const express = require("express");
const {
  createOrder,
  getOrder,
  getAllOrders,

  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");
const verifyToken = require("../middlewares/auth.middleware");

const orderRouter = express.Router();

orderRouter.route("/create").post(verifyToken, createOrder);
orderRouter.route("/success").get(updateOrder);
orderRouter.route("/all").get(getAllOrders);
orderRouter.route("/:orderId").get(getOrder);
orderRouter.route("/:orderId").delete(deleteOrder);

module.exports = orderRouter;
