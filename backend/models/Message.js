const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatSession",
        required: true
    },
    sender: {
        role: {
            type: String,
            enum: ["user", "guest"],
            required: true,
        },
        refId: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    content: {
        type: String,
        required: true
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema)