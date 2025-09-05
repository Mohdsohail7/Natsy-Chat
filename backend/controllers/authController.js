import ChatSession from "../models/ChatSession";
import GuestSession from "../models/GuestSession";
import Message from "../models/Message";
import User from "../models/User";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Generate JWT Registered user token
const signUserToken = (id) => {
  return jwt.sign({ id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const signGuestToken = (sessionId, username) => {
  return jwt.sign({ role: "guest", sessionId, username }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};

// guest login
exports.guestLogin = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username || username.trim().length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters." });
        }
        const cleanUsername = username.trim();

        // Block if username already taken by a registered user
        const userExist = await User.findOne({ username: cleanUsername });
        if (userExist) {
            return res.status(400).json({ message: "Username is already taken by a registered user. Please choose another." });
        }

        // Block if there is an active (not consumed & not expired) guest session for this username
        const guestUserActive = await GuestSession.findOne({
            username: cleanUsername,
            consumed: false,
            expiresAt: { $gt: new Date() },
        });
        if (guestUserActive) {
            return res.status(400).json({ message: "Username is already taken by a registered user. Please choose another."})
        }
        // Create session (valid for 2 hours — change after i needed)
        const sessionId = crypto.randomBytes(16).toString("hex");
        const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
        await GuestSession.create({
            username: cleanUsername,
            sessionId,
            consumed: false,
            expiresAt,
        });

        const token = signGuestToken(sessionId, cleanUsername);
        return res.status(201).json({
            role: "guest",
            username: cleanUsername,
            token,
            sessionId,
            expiresAt,
            message: "Guest session started. You can use random text chat until you logout or the session expires.",
        });
    } catch (error) {
        console.error("Guest login failed:", error);
        return res.status(500).json({ message: "Guest login failed, try again later." });
  }
}

// Register user
exports.registerUser = async (req, res) => {
    try {
        const { email, password, guestSessionId, username: usernameProvided } = req.body;
        // email validate
        if (!email || email.length === 0) {
            return res.status(400).json({ message: "Email is required."});
        }
        // Email format validation 
        if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format." });
        }
        // password validate
        if (!password || password.length === 0) {
            return res.status(400).json({ message: "Password is required."});
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        // Determine username:
        let finalUsername = null;
        if (guestSessionId) {
            const session = await GuestSession.findOne({
                sessionId: guestSessionId,
                consumed: false,
                expiresAt: { $gt: new Date() },
        });
        if (!session) {
            return res.status(400).json({ message: "Invalid or expired guest session id." });
        }
        // make sure username not taken by another registered user
        const userExist = await User.findOne({ username: session.username });
        if (userExist) {
            // unexpected but safe check
            return res.status(400).json({ message: "username already taken by a registered user." });
        }
        finalUsername = session.username;
    } else if (usernameProvided) {
      if (usernameProvided.trim().length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters." });
      }
      // ensure username not already used by another user
      const userExist = await User.findOne({ username: usernameProvided.trim() });
      if (userExist) return res.status(400).json({ message: "Username already taken." });
      finalUsername = usernameProvided.trim();
    } else {
      finalUsername = undefined;
    }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString("hex")

        const userData = {
            email: email.toLowerCase(),
            password: hashedPassword,
            verificationToken,
            isVerified: false,
        };
        if (finalUsername) userData.username = finalUsername;

        const user = await User.create(userData);
        // If we used a guest session, consume it now (prevent further guest use)
        if (guestSessionId) {
            await GuestSession.findOneAndUpdate({ sessionId: guestSessionId }, { consumed: true });

            // migrate chats + messages
            await ChatSession.updateMany(
                { "participants.refId": guestSessionId },
                {
                $set: {
                    "participants.$[elem].refId": user._id.toString(),
                    "participants.$[elem].role": "user",
                },
                },
                { arrayFilters: [{ "elem.refId": guestSessionId }] }
            );

            await Message.updateMany(
            { "sender.refId": guestSessionId },
            {
            $set: {
                "sender.refId": user._id.toString(),
                "sender.role": "user",
            },
            }
          );
        }

        // Return verification link (later send email via nodemailer)
        return res.status(201).json({
            message: "Registered. Please verify your email to enable permanent login.",
            verificationLink: `http://localhost:5000/api/auth/verify/${verificationToken}`,
        });

    } catch (error) {
        console.error("Registration failed.", error)
        return res.status(500).json({ message: "Registration failed. Please try again later." });
    }
}

// Verify user email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        // validate token
        if (!token) {
            return res.status(400).json({ message: "Verification token is required."});
        }

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token"});
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        return res.status(200).json({ message: "Email verified successfully!."});
    } catch (error) {
        console.error("Email verification failed.", error);
        return res.status(500).json({ message: "Something went wrong. Please try again email verification."});
    }
}

// login user
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || username.length === 0) {
            return res.status(400).json({ message: "User is required."});
        }
        if (!password ||password.length === 0) {
            return res.status(400).json({ message: "Password is required."});
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not Found."});
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid password." });
        }
        const token = signUserToken(user._id);
        return res.status(200).json({
            _id: user._id,
            username: user.username,
            token,
        })
    } catch (error) {
        console.log("Login failed.", error);
        return res.status(500).json({ message: "Something went wrong. Please try again."});
    }
}

// logout (both)
exports.logout = async (req, res) => {
  try {
    if (req.role === "guest" && req.guest?.sessionId) {
      await GuestSession.updateOne(
        { sessionId: req.guest.sessionId },
        { consumed: true }
      );
      return res.json({ message: "Guest logged out successfully" });
    }

    if (req.role === "user") {
      // Nothing to do, JWT is stateless → just let it expire
      return res.json({ message: "User logged out successfully" });
    }

    return res.status(400).json({ message: "Invalid logout request" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};