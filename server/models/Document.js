const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ""  // ✅ THIS is key
  }
});

module.exports = mongoose.model("Document", DocumentSchema);
