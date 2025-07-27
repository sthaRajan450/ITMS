const express = require("express");
const {
  createCheckoutSession,
  stripeWebhookHandler,
} = require("../controllers/stripe.controller");
const stripeRouter = express.Router();

stripeRouter.route("/create-checkout-session").post(createCheckoutSession);
stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);
module.exports = stripeRouter;
