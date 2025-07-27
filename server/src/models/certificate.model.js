const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  //   internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
  title: { type: String, required: true },
  description: { type: String },
  issuedAt: { type: Date, default: Date.now },
  certificateUrl: { type: String }, // URL or path to PDF/image
  status: { type: String, enum: ["issued", "revoked"], default: "issued" },
});

const Certificate = mongoose.model("Certificate", certificateSchema);
module.exports = Certificate;


