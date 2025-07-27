import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import { toast } from "react-toastify";

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch pending reviews (admin only)
  const getPendingReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/review/pending`, {
        credentials: "include", // send cookies if using sessions
      });
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Approve review by ID
  const approveReview = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/review/approve/${id}`, {
        method: "PUT",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to approve review");
      const data = await response.json();
      toast.success(data.message || "Review approved successfully");
      // Refresh the list after approval
      getPendingReviews();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPendingReviews();
  }, []);

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pending Reviews</h1>
      {reviews.length === 0 ? (
        <p>No pending reviews.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">User</th>
              <th className="border border-gray-300 p-2">Course</th>
              <th className="border border-gray-300 p-2">Rating</th>
              <th className="border border-gray-300 p-2">Comment</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id} className="text-center">
                <td className="border border-gray-300 p-2">
                  {review.user?.fullName || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {review.course?.title || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">{review.rating}</td>
                <td className="border border-gray-300 p-2">{review.comment}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => approveReview(review._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReviewManagement;
