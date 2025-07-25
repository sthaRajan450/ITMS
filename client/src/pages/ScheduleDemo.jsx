import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BASE_URL } from "../config/api";
import { AuthContext } from "../context/AuthProvider";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const ScheduleDemo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};

  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  const { isAuth } = useContext(AuthContext);

  const ALL_SLOTS = ["10:00 AM", "2:00 PM", "4:00 PM"];
  const getFormattedDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    if (!selectedDate || !course?._id) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await fetch(
          `${BASE_URL}/demo/slots/${course._id}?date=${getFormattedDate(
            selectedDate
          )}`
        );
        const data = await res.json();
        console.log(data);
        setAvailableSlots(data.availableSlots || []);
      } catch (err) {
        toast.error("Failed to fetch available slots");
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, course]);

  const handleBooking = async () => {
    if (!isAuth) {
      toast.error("Please login to book a demo session.");
      return navigate("/login");
    }

    try {
      const res = await fetch(`${BASE_URL}/demo/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          courseId: course._id,
          date: getFormattedDate(selectedDate),
          timeSlot: selectedTime,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          `Demo booked for ${getFormattedDate(selectedDate)} at ${selectedTime}`
        );
        setSelectedDate(null);
        setSelectedTime("");
        setAvailableSlots([]);
      } else {
        toast.error(data.message || "Booking failed");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="min-h-2/3 mb-14 flex justify-between items-center">
      <div className="bg-white p-6 rounded-xl shadow-md border w-full max-w-[800px] mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          📅 Schedule a Demo Session{" "}
          <span className="text-orange-700">{course?.title}</span>
        </h2>
        <div className="flex justify-center mb-4">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileDisabled={({ date }) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const isPast = date < today; // disable past dates
              const day = date.getDay(); // Sunday = 0, Saturday = 6
              const isWeekend = day === 0 || day === 6; // disable Sat & Sun

              return isPast || isWeekend;
            }}
          />
        </div>

        {selectedDate && (
          <div className="mt-6 ">
            <h3 className="text-lg text-center font-medium mb-2">
              Available Time Slots for {getFormattedDate(selectedDate)}
            </h3>

            {loadingSlots ? (
              <p>Loading slots...</p>
            ) : (
              <div className="flex justify-center flex-wrap gap-3">
                {ALL_SLOTS.map((slot) => {
                  const isBooked = availableSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => !isBooked && setSelectedTime(slot)}
                      className={`px-4 py-2 rounded-md border transition ${
                        isBooked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : selectedTime === slot
                            ? "bg-orange-600 text-white"
                            : "hover:bg-orange-100 border-gray-300"
                      }`}
                      disabled={isBooked}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {selectedTime && (
          <div className="mt-6 text-center">
            <button
              onClick={handleBooking}
              className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition"
            >
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleDemo;
