import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

const FinancialManagement = () => {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/order/all`, {
        method: "GET",
        credentials: "include", // if using cookies for auth
      });
      const data = await response.json();
      console.log(data.data);
      setOrders(data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);
 const getTotalRevenue = () => {
  return orders
    .filter(order => order.paymentStatus !== "PENDING")
    .reduce((acc, order) => {
      const courseTotal = order.course.reduce(
        (sum, courseItem) => sum + Number(courseItem.course_id.price),
        0
      );
      return acc + courseTotal;
    }, 0);
};


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Financial Management</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Total Revenue: NPR {getTotalRevenue().toLocaleString()}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">User Email</th>
              <th className="p-2 border">Courses</th>
              <th className="p-2 border">Total Price</th>
              <th className="p-2 border">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const totalPrice = order.course.reduce(
                (sum, item) => sum + Number(item.course_id.price),
                0
              );

              return (
                <tr key={order._id} className="text-center">
                  <td className="p-2 border">{order._id}</td>
                  <td className="p-2 border">{order.user?.email}</td>
                  <td className="p-2 border">
                    {order.course.map((item) => (
                      <div key={item._id}>
                        {item.course_id.title} ({item.course_id.duration}) — NPR{" "}
                        {Number(item.course_id.price).toLocaleString()}
                      </div>
                    ))}
                  </td>

                  <td className="p-2 border">
                    NPR {totalPrice.toLocaleString()}
                  </td>
                  <td className="p-2 border">{order.paymentStatus}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialManagement;
