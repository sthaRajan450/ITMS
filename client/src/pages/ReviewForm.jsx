import { useState } from "react";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { BASE_URL } from "../config/api";

const ReviewForm = ({ courseId, userId }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}/review/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, userId, rating, comment }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
      setComment("");
      setRating(0);
    } else {
      toast.error(data.message || "Failed to submit review.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-lg shadow-md bg-white"
    >
      <label className="block text-gray-700 font-medium">Your Review</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your honest feedback..."
        className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        required
        rows={4}
      />

      <div className="flex items-center space-x-2">
        <span className="text-gray-700 font-medium">Rating:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            onClick={() => setRating(star)}
            className={`cursor-pointer text-2xl transition ${
              rating >= star ? "text-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>

      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md transition duration-200"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
