const mongoose = require("mongoose");
const crypto = require("crypto");

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    token: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(16).toString("hex"),
    },
    feedbackCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
