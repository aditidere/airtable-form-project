const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
    airtableRecordId: { type: String },  // ID from Airtable after saving
    answers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,   // stores { questionKey: answerValue }
      required: true,
    },
    deletedInAirtable: { type: Boolean, default: false }, // for webhook sync
  },
  { timestamps: true }
);

module.exports = mongoose.model("Response", responseSchema);
