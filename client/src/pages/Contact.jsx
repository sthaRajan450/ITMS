import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // you can send this to your backend API later
    setForm({ fullName: "", email: "", message: "" });
    alert("Message sent successfully!");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-20 px-6 font-inter">
      <div className="max-w-5xl mx-auto text-center mb-14">
        <h1 className="text-5xl font-semibold text-gray-700 mb-6">
          📞 Get in Touch
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          Questions, feedback or collaboration proposals? Drop us a message or
          reach out through our contact details.
        </p>
      </div>

      {/* Contact Info */}
      <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-8 text-center mb-20">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">📧 Email</h3>
          <p className="text-gray-600">info@itmsnepal.com</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">📱 Phone</h3>
          <p className="text-gray-600">+977 9800000000</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">📍 Address</h3>
          <p className="text-gray-600">Putalisadak, Kathmandu, Nepal</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-full mx-auto flex gap-x-20 bg-white p-8 rounded-2xl shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.4810611886537!2d85.3408743826627!3d27.67152291484454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190536c1caa7%3A0xf92fcf603dac3960!2sSipalaya%20Info%20Tech%20Pvt.%20Ltd.!5e0!3m2!1sen!2snp!4v1753155467023!5m2!1sen!2snp"
          width={600}
          height={450}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            📝 Send a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none text-lg"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none text-lg"
            />
            <textarea
              name="message"
              rows="5"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none text-lg"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-400 to-orange-400 text-white py-3 rounded-xl text-lg font-bold hover:opacity-90 transition"
            >
              📤 Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
