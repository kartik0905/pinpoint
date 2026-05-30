const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    screenshot: {
      type: String, 
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String, 
    },
    browser: {
      type: String,
    },
    device: {
      type: String,
    },
    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Feedback", feedbackSchema);
