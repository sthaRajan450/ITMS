const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    course: [
      {
        course_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    paymentMethod: {
      type: String,
      // required: true,
      defaut: "esewa",
    },
    paymentStatus: {
      type: String,
      enum: [
        "PENDING",
        "COMPLETE",
        "FULL_REFUND",
        "PARTIAL_REFUND",
        "AMBIGUOUS",
        "NOT_FOUND",
        "CANCELED",
        "Service is currently unavailable",
      ],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
