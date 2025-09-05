const express = require("express");
const router = express.Router();

const authControllers = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/auth");


// ===============================
//  GUEST LOGIN
// ===============================
router.post("/guest-login", authControllers.guestLogin);

// ===============================
//  USER REGISTER
// ===============================
router.post("/register", authControllers.registerUser);

// ===============================
//  USER LOGIN
// ===============================
router.post("/login", authControllers.loginUser);

// ===============================
//  EMAIL VERIFY
// ===============================
router.get("/verify/:token", authControllers.verifyEmail)

// ===============================
//  LOGOUT (USER & GUEST)
// ===============================
router.post("/logout", authMiddleware, authControllers.logout);
