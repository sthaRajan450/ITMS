import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

const Success = () => {
  const [order, setOrder] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const getOrder = async () => {
    try {
      const response = await fetch(`${BASE_URL}/order/${orderId}`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        setOrder(data.data);
      }
    } catch (error) {
      console.log("Failed to get order:", error);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const response = await fetch(`${BASE_URL}/course/enroll/${courseId}`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(`Enrolled in course ${courseId}:`, data.message);
      }
    } catch (error) {
      console.log("Error while enrolling into the course", error);
    }
  };

  const handleEnrollAll = async () => {
    if (order && order.course.length) {
      setEnrolling(true);
      for (let item of order.course) {
        await handleEnroll(item.course_id);
      }
      navigate("/");
    }
  };

  useEffect(() => {
    getOrder();
  }, [orderId]);

  return (
    <div>
      {order ? (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            🎉 Order Successfully Placed!
          </h2>
          <p className="text-lg text-gray-800 mb-2">
            <span className="font-semibold">Order ID:</span> {order._id}
          </p>
          <p className="text-lg text-gray-800 mb-4">
            <span className="font-semibold">Payment Status:</span>{" "}
            <span
              className={`font-bold ${
                order.paymentStatus === "COMPLETE"
                  ? "text-green-500"
                  : "text-yellow-500"
              }`}
            >
              {order.paymentStatus}
            </span>
          </p>

          <div className="border-t pt-4">
            <h3 className="text-xl font-semibold mb-2">Courses:</h3>
            <ul className="text-left">
              {order.course.map((item) => (
                <li
                  key={item._id}
                  className="py-2 border-b last:border-none flex justify-between items-center"
                >
                  <div>
                    <span className="text-gray-700 block">
                      Course ID: {item.course_id}
                    </span>
                    <span className="text-gray-800 font-medium">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleEnrollAll}
            disabled={enrolling}
            className={`mt-6 px-6 py-2 rounded-lg text-white transition duration-200 ${
              enrolling
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {enrolling ? "Enrolling..." : "OK"}
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-10">
          Loading order details...
        </p>
      )}
    </div>
  );
};

export default Success;
