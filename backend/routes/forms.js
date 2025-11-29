const express = require("express");
const router = express.Router();
const Form = require("../models/Form");
const User = require("../models/User");

// Middleware: attach user from ?userId=...
router.use(async (req, res, next) => {
  const userId = req.query.userId || req.headers["x-user-id"];
  if (!userId) return res.status(401).json({ message: "Missing userId" });

  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ message: "Invalid user" });

  req.user = user;
  next();
});

/**
 * POST /api/forms
 * Create a new form
 */
router.post("/", async (req, res) => {
  try {
    const { name, airtableBaseId, airtableTableId, questions } = req.body;

    if (!name || !airtableBaseId || !airtableTableId || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // Allowed field types
    const supportedTypes = ["shortText", "longText", "singleSelect", "multiSelect", "attachment"];

    for (const q of questions) {
      if (!supportedTypes.includes(q.type)) {
        return res.status(400).json({ message: `Unsupported field type: ${q.type}` });
      }
    }

    const form = await Form.create({
      owner: req.user._id,
      airtableBaseId,
      airtableTableId,
      name,
      questions,
    });

    res.status(201).json(form);
  } catch (error) {
    console.error("Create form error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/forms/:formId
 * Get form details
 */
router.get("/:formId", async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    res.json(form);
  } catch (error) {
    console.error("Get form error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
