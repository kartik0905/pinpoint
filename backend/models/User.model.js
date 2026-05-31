const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Not required — Google users won't have a password
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
    },
    name: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
