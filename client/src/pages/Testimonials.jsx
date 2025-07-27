import React, { useEffect, useState } from "react";

const Testimonials = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getReviews = async () => {
    try {
      const response = await fetch(`/api/review/${courseId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews.");
      }
      const data = await response.json();
      setReviews(data.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReviews();
  }, [courseId]);

  return (
    <section className="bg-gray-50 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">
        Student Testimonials
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading testimonials...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-700 italic mb-4">
                "{r.comment.length > 150 ? r.comment.slice(0, 150) + "..." : r.comment}"
              </p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-primary">{r.user?.name}</span>
                <span className="text-yellow-500">
                  {[...Array(r.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Testimonials;
