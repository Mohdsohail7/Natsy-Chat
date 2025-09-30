const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 20,
        unique: true,
        sparse: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    fullName: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: ""
    },
    avatar: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false, // user starts unverified
    },
    verificationToken: {
        type: String // random string for verification link
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
},
{
    timestamps: true
}
);
module.exports = mongoose.model("User", userSchema);