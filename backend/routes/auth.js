const express = require("express");
const router = express.Router();
const User = require("../models/User");

/**
 * POST /api/auth/mock-login
 * This simulates Airtable OAuth login.
 * It accepts a fake Airtable user ID & token and stores them in MongoDB.
 */
router.post("/mock-login", async (req, res) => {
  try {
    const { airtableUserId, name, email, accessToken } = req.body;

    if (!airtableUserId || !accessToken) {
      return res.status(400).json({
        message: "airtableUserId and accessToken are required",
      });
    }

    let user = await User.findOne({ airtableUserId });

    if (!user) {
      user = await User.create({
        airtableUserId,
        name,
        email,
        accessToken,
        lastLoginAt: new Date(),
      });
    } else {
      user.accessToken = accessToken;
      user.lastLoginAt = new Date();
      await user.save();
    }

    res.json({
      message: "Login successful",
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Mock login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
