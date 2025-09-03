const mongoose = require("mongoose");

const guestSessionSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, unique: true },
    consumed: { type: Boolean, default: false }, // not consumed until logout/close
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL will remove the doc after expiresAt
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GuestSession", guestSessionSchema);
