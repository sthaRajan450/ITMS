import React from "react";
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";

const Payment = () => {
  const location = useLocation();
  const { order_id, totalAmount } = location.state;

  const Message = `total_amount=${10},transaction_uuid=${order_id},product_code=EPAYTEST`;
  const hash = CryptoJS.HmacSHA256(Message, "8gBm/:&EnhH.1/q");
  const signature = CryptoJS.enc.Base64.stringify(hash);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Payment Details
        </h2>
        <form
          action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
          method="POST"
          className="space-y-4"
        >
          <div>
            <input
              type="hidden"
              id="amount"
              name="amount"
              value={10}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <input type="hidden" name="tax_amount" value="0" />
          <input type="hidden" name="product_service_charge" value="0" />
          <input type="hidden" name="product_delivery_charge" value="0" />
          <input
            type="hidden"
            name="success_url"
            value="http://localhost:9000/api/v1/order/success"
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

          <div>
            <label className="block text-gray-700 mb-1" htmlFor="total_amount">
              Total Amount
            </label>
            <input
              type="text"
              id="total_amount"
              name="total_amount"
              value={10}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <input
              type="hidden"
              id="transaction_uuid"
              name="transaction_uuid"
              value={order_id}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <input
              type="hidden"
              id="product_code"
              name="product_code"
              value="EPAYTEST"
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <input
              type="hidden"
              id="signature"
              name="signature"
              value={signature}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
