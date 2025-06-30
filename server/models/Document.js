const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  _id: String,
  content: {
    type: String,
    required: true,
    default: "" // 🔥 Important to avoid validation error
  }
});

module.exports = mongoose.model("Document", DocumentSchema);
