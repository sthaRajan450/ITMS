import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getReviews = async () => {
    try {
      const response = await fetch(`${BASE_URL}/review/all`);
      if (!response.ok) throw new Error("Failed to fetch reviews.");
      const data = await response.json();
      setReviews(data.data);
    } catch (err) {
      setError("Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <section className="bg-gray-50 py-16">
      <h2 className="text-5xl font-semibold text-center mb-10 text-gray-700">
        Testimonials
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading testimonials...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews yet.</p>
      ) : (
        <div className="max-w-4xl mx-auto px-4">
          <Slider {...settings}>
            {reviews.map((r) => (
              <div key={r._id} className="px-2">
                <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
                  {r.user?.avatar && (
                    <img
                      src={r.user.avatar}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full shadow-md mb-4 object-cover"
                    />
                  )}
                  <p className="text-gray-600 italic mb-6">
                    "
                    {r.comment.length > 150
                      ? r.comment.slice(0, 150) + "..."
                      : r.comment}
                    "
                  </p>
                  <h3 className="text-indigo-700 font-semibold text-lg">
                    {r.user?.fullName || "Anonymous"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {r.course?.title}
                  </p>
                  <div className="text-yellow-500 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < r.rating ? "⭐" : "☆"}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
