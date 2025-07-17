import React, { useState } from "react";
import { BASE_URL } from "../config/api";
const SendMessage = ({ receiverId, courseId }) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message) return alert("Message cannot be empty");

    const response = await fetch(`${BASE_URL}/message/send`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiver: receiverId, course: courseId, message }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      setMessage("");
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border w-full p-2"
        placeholder="Type feedback here..."
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
      >
        Send Feedback
      </button>
    </div>
  );
};

export default SendMessage;
