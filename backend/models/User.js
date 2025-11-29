const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    airtableUserId: { type: String, required: true, unique: true },
    name: String,
    email: String,
    accessToken: String,   // Airtable token (for now we’ll store manually)
    refreshToken: String,  // not used in simple version, but kept for future
    lastLoginAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
