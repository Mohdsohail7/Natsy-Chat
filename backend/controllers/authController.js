const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Generate JWT 
const generateToken  = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

// Register user
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // username validate
        if (!username || username.length === 0) {
            return res.status(400).json({ message: "Username is required."});
        }
        // username length validate 
        if (username.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters."});
        }
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

        // Check if email exists
        const userExists = await User.findOne({ username });
        if (userExists) {
        return res.status(400).json({ message: "Username already registered." });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

         // Create user (unverified)
        const user = await User.create({
        username,
        email,
        password: hashedPassword,
        verificationToken,
        isVerified: false,
        });

        // Allow temporary login until logout/tab close
        return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        token: generateToken(user._id),
        message: "User registered successfully. Please verify your email.",
        verificationLink: `http://localhost:5000/api/auth/verify/${verificationToken}`, // use Nodemailer later
        });

    } catch (error) {
        console.error({ message: "Registration is failed.", error: error.message})
        return res.status(500).json({ message: "Server Error",error: error.message });
    }
}