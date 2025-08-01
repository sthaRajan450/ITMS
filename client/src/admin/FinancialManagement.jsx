import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

const FinancialManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterType, setFilterType] = useState("all");

  const getOrders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/order/all`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setOrders(data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    filterOrdersByDate();
  }, [orders, filterType]);

  const filterOrdersByDate = () => {
    const now = new Date();
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      if (filterType === "daily") {
        return orderDate.toDateString() === now.toDateString();
      } else if (filterType === "weekly") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return orderDate >= weekAgo;
      } else if (filterType === "monthly") {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      } else {
        return true;
      }
    });

    setFilteredOrders(filtered);
  };

  const getTotalRevenue = () => {
    return filteredOrders
      .filter((order) => order.paymentStatus !== "PENDING")
      .reduce((acc, order) => {
        const courseTotal = order.course.reduce(
          (sum, courseItem) => sum + Number(courseItem.course_id.price),
          0
        );
        return acc + courseTotal;
      }, 0);
  };

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "User Email",
      "Course Titles",
      "Total Price (NPR)",
      "Payment Status",
      "Date",
    ];

    const rows = filteredOrders.map((order) => {
      const courseTitles = order.course
        .map((item) => `${item.course_id.title} (${item.course_id.duration})`)
        .join(" | ");

      const totalPrice = order.course.reduce(
        (sum, item) => sum + Number(item.course_id.price),
        0
      );

      return [
        order._id,
        order.user?.email || "N/A",
        courseTitles,
        totalPrice,
        order.paymentStatus,
        new Date(order.createdAt).toLocaleString(),
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "financial_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Financial Management</h1>
        <div className="flex items-center gap-3">
          <select
            className="border border-gray-300 px-3 py-1 rounded"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
          </select>
          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📄 Export CSV
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Total Revenue: NPR {getTotalRevenue().toLocaleString()}
        </h2>
        <p className="text-sm text-gray-500">Filtered by: {filterType}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 print:text-xs print:w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border border-gray-300">Order ID</th>
              <th className="p-2 border border-gray-300">User Email</th>
              <th className="p-2 border border-gray-300">Courses</th>
              <th className="p-2 border border-gray-300">Total Price</th>
              <th className="p-2 border border-gray-300">Payment Status</th>
              <th className="p-2 border border-gray-300 print:hidden">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const totalPrice = order.course.reduce(
                (sum, item) => sum + Number(item.course_id.price),
                0
              );

              return (
                <tr key={order._id} className="text-center">
                  <td className="p-2 border border-gray-300">{order._id}</td>
                  <td className="p-2 border border-gray-300">
                    {order.user?.email}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {order.course.map((item) => (
                      <div key={item._id}>
                        {item.course_id.title} ({item.course_id.duration}) — NPR{" "}
                        {Number(item.course_id.price).toLocaleString()}
                      </div>
                    ))}
                  </td>
                  <td className="p-2 border border-gray-300">
                    NPR {totalPrice.toLocaleString()}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {order.paymentStatus}
                  </td>
                  <td className="p-2 border border-gray-300 print:hidden">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
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
