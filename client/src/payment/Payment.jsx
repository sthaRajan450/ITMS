import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";
import { BASE_URL } from "../config/api";
import { toast } from "react-toastify";

const Payment = () => {
  const location = useLocation();
  const { order_id, totalAmount } = location.state;

  const [gateway, setGateway] = useState("esewa");

  // Generate eSewa signature
  const Message = `total_amount=${totalAmount},transaction_uuid=${order_id},product_code=EPAYTEST`;
  const hash = CryptoJS.HmacSHA256(Message, "8gBm/:&EnhH.1/q"); // Replace with your secret key
  const signature = CryptoJS.enc.Base64.stringify(hash);

  // Stripe payment handler
  const handleStripePayment = async () => {
    try {
      const res = await fetch(`${BASE_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // optional if using cookies for auth
        body: JSON.stringify({
          order_id,
          items: [
            {
              name: "Course/Product", // customize
              price: totalAmount, // amount in your currency (e.g. NPR)
              quantity: 1,
            },
          ],
        }),
      });

      const data = await res.json();
      console.log("Stripe create session response:", data.url);

      if (data?.data?.url) {
        window.location.href = data.data.url; // Redirect to Stripe checkout
      } else {
        toast.error(
          "Stripe session creation failed: " +
            (data?.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Stripe error:", err);
      toast.error("Stripe error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Choose Payment Gateway
        </h2>

        <div className="flex justify-center gap-6 mb-6">
          <label>
            <input
              type="radio"
              value="esewa"
              checked={gateway === "esewa"}
              onChange={() => setGateway("esewa")}
            />{" "}
            eSewa
          </label>
          <label>
            <input
              type="radio"
              value="stripe"
              checked={gateway === "stripe"}
              onChange={() => setGateway("stripe")}
            />{" "}
            Stripe
          </label>
        </div>

        {gateway === "esewa" ? (
          <form
            action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
            method="POST"
            className="space-y-4"
          >
            <input type="hidden" name="amount" value={totalAmount} />
            <input type="hidden" name="tax_amount" value="0" />
            <input type="hidden" name="product_service_charge" value="0" />
            <input type="hidden" name="product_delivery_charge" value="0" />
            <input
              type="hidden"
              name="success_url"
              value={`${BASE_URL}/order/success`}
            />
            <input
              type="hidden"
              name="failure_url"
              value="https://developer.esewa.com.np/failure"
            />
            <input
              type="hidden"
              name="signed_field_names"
              value="total_amount,transaction_uuid,product_code"
            />
            <input type="hidden" name="total_amount" value={totalAmount} />
            <input type="hidden" name="transaction_uuid" value={order_id} />
            <input type="hidden" name="product_code" value="EPAYTEST" />
            <input type="hidden" name="signature" value={signature} />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
            >
              Pay with eSewa
            </button>
          </form>
        ) : (
          <button
            onClick={handleStripePayment}
            className="w-full bg-purple-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition"
          >
            Pay with Stripe
          </button>
        )}
      </div>
    </div>
  );
};

export default Payment;
