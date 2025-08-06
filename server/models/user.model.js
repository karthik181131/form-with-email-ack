const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: String, required: true },
    programme: {
      type: String,
      required: true,
      enum: ["BTech", "MTech", "PhD"],
    },
    rollNumber: { type: String },
    branch: { type: String, required: true },
    personalEmail: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    emergencyContactName: { type: String, required: true },
    emergencyContactPhone: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
