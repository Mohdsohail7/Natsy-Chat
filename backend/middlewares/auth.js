const jwt = require("jsonwebtoken");
const User = require("../models/User");
const GuestSession = require("../models/GuestSession");


exports.authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided."});
        }

        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // registered user
        if (decode.role === "user") {
            const user = await User.findById(decode.id).select("-password");
            if (!user) {
                return res.status(401).json({ message: "Invalid token: user not found."});
            }
            if (!user.isVerified) {
                return res.status(403).json({ message: "Email not verified. Please verify before accessing this feature."});
            }

            req.user = user;
            req.role = "user";
        } 
        // guest session
        else if (decode.role === "guest") {
            const session = await GuestSession.findOne({
                sessionId: decode.sessionId,
                consumed: false,
                expiresAt: { $gt: new Date()},
            });

            if (!session) {
                return res.status(401).json({ message: "Invalid or expired guest session."});
            }

            req.guest = { username: decode.username, sessionId: decode.sessionId };
            req.role = "guest";

        } else {
            return res.status(401).json({ message: "Invalid token."});
        }

        next();
    } catch (error) {
        console.error("Auth Middleware error.", error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired." });
        }
            return res.status(401).json({ message: "Invalid token." });
    }
}

// only registered Users
exports.requireUser = (req, res, next) => {
    if (req.role === "user" && req.user) {
        return next();
    }
    return res.status(403).json({ message: "Access denied. Registered users only."});
};

// only guests 
exports.requireGuest = (req, res, next) => {
    if (req.role === "guest" && req.guest) {
        return next();
    }
    return res.status(403).json({ message: "Access denied. Guests user only."})
}

// any authenticated role (user OR guest)
exports.requireAuth = (req, res, next) => {
  if ((req.role === "user" && req.user) || (req.role === "guest" && req.guest)) {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Login required." });
};
