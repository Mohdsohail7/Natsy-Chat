const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const friendRequestController = require("../controllers/friendController");
const router = express.Router();

// =============================================
// Only logged-in users can send requests
// =============================================
router.post("/send-request", authMiddleware, friendRequestController.sendFriendRequest);

module.exports = router;