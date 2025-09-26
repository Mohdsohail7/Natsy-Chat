const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "guest"],
    required: true,
  },
  refId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

const chatSessionSchema = new mongoose.Schema(
  {
    participants: [participantSchema],
    status: {
      type: String,
      enum: ["waiting", "active", "ended"],
      default: "waiting",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatSession", chatSessionSchema);
