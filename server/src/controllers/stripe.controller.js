const Stripe = require("stripe");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const Order = require("../models/order.model");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = asyncHandler(async (req, res) => {
  const { items } = req.body;
  console.log("Received items:", items);

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json(new ApiResponse(400, "No items provided"));
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map((item) => ({
      price_data: {
        currency: "npr", // or 'usd' for fallback/testing
        product_data: {
          name: item.name || "Untitled Product",
        },
        unit_amount: Math.round(item.price * 100), // amount in paisa (smallest unit)
      },
      quantity: item.quantity || 1,
    })),
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/success/${req.body.order_id}`,
    cancel_url: `${process.env.CLIENT_URL}/failure`,
    metadata: {
      order_id: req.body.order_id, // ✅ Required for webhook!
    },
  });

  console.log("Stripe session created:", session.url);

  if (!session.url) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Stripe session URL missing"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Stripe session created", { url: session.url }));
});

const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { status: "Complete" });
      console.log(`✅ Order ${orderId} marked as Complete via webhook`);
    }
  }

  res.status(200).send("Webhook received");
};

module.exports = {
  createCheckoutSession,
  stripeWebhookHandler,
};
