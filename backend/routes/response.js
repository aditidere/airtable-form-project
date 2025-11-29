const express = require("express");
const router = express.Router();
const Form = require("../models/Form");
const Response = require("../models/Response");
const User = require("../models/User");
const { getAirtableClient } = require("../utils/airtableClient");

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
 * POST /api/responses/:formId
 * Submit a response & push data to Airtable
 */
router.post("/:formId", async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    const { answers } = req.body;
    if (!answers) return res.status(400).json({ message: "Answers missing" });

    // Build field mapping for Airtable
    const fields = {};
    form.questions.forEach(q => {
      fields[q.label] = answers[q.questionKey];
    });

    // Push to Airtable
    const airtable = getAirtableClient(req.user.accessToken);

    let airtableRecord = null;
    try {
      airtableRecord = await airtable.createRecord(
        form.airtableBaseId,
        form.airtableTableId,
        fields
      );
    } catch (err) {
      console.log("Airtable error:", err.response?.data || err.message);
    }

    // Save in MongoDB also
    const saved = await Response.create({
      formId: form._id,
      answers,
      airtableRecordId: airtableRecord?.id || null,
    });

    res.status(201).json({
      message: "Response stored successfully",
      responseId: saved._id,
    });

  } catch (error) {
    console.error("Submit response error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
