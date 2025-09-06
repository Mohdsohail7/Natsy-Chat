const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");
const { authMiddleware, requireAuth } = require("../middlewares/auth");

// ===============================
//  RANDOM CHAT (REST fallback)
// ===============================
router.post("/random", authMiddleware, requireAuth, chatController.randomChat);

// ===============================
//  SEND MESSAGE (REST fallback)
// ===============================
router.post("/send", authMiddleware, requireAuth, chatController.sendMessage);

// ===============================
//  FETCH MESSAGES
// ===============================
router.get(
  "/messages/:chatId",authMiddleware,requireAuth,chatController.fetchMessages
);

// ===============================
//  LEAVE CHAT
// ===============================
router.post("/leave/:chatId", authMiddleware, requireAuth, chatController.leaveChat);

module.exports = router;
