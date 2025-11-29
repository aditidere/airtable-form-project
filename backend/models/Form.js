const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: { type: [String], default: [] },

  // REMOVE REQUIRED because frontend does NOT send these
  airtableFieldId: { type: String, required: false },
  questionKey: { type: String, required: false }
});

const FormSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, default: "Untitled Form" },
  airtableBaseId: { type: String, required: true },
  airtableTableId: { type: String, required: true },
  questions: [QuestionSchema],
});

module.exports = mongoose.model("Form", FormSchema);
