const express = require("express");
const router = express.Router();
const Response = require("../models/Response");

/**
 * POST /api/webhooks/airtable
 * Handles Airtable webhook events
 */
router.post("/airtable", async (req, res) => {
  try {
    const event = req.body;

    if (!event || !event.type) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }

    // Airtable event types (simplified)
    const recordId = event.recordId;

    if (!recordId) {
      return res.status(400).json({ message: "Missing recordId" });
    }

    // Handle update event
    if (event.type === "record.updated") {
      await Response.findOneAndUpdate(
        { airtableRecordId: recordId },
        {
          answers: event.newValues || {},
          updatedAt: new Date(),
        }
      );
    }

    // Handle delete event
    if (event.type === "record.deleted") {
      await Response.findOneAndUpdate(
        { airtableRecordId: recordId },
        {
          deletedInAirtable: true,
        }
      );
    }

    return res.status(200).json({ message: "Webhook processed" });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
