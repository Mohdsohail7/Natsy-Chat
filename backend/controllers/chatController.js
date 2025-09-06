const ChatSession = require("../models/ChatSession");
const Message = require("../models/Message");



// Random chat via REST 
exports.randomChat = async (req, res) => {
    try {
        // pick random waiting user
        let waiting = await ChatSession.findOne({ status: "waiting" });

        if (waiting) {
            waiting.participants.push(req.user?._id || req.guest.sessionId);
            waiting.status = "active";
            await waiting.save();
            return res.json({ message: "Matched", chatId: waiting._id});
        }

        // create waiting session
        const newSession = await ChatSession.create({
            participants: [req.user?._id || req.guest.sessionId],
            status: "waiting",
        });

        return res.json({ message: "Waiting for match", chatId: newSession._id });
    } catch (error) {
        console.error("random chat error", error);
        return res.status(500).json({ message: "Error starting random chat" });
    }
};

// send message
exports.sendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;
        const sender = req.user?._id || req.guest.sessionId;

        const msg = await Message.create({ chatId, sender, content });

        return res.json({ msg });
    } catch (error) {
        console.error("Error in send message", error);
        return res.status(500).json({ message: "Error sending message" });
    }
};


// Fetch Messages
exports.fetchMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const msgs = await Message.find({ chatId }).sort({ createdAt: 1 });
        res.json(msgs)
    } catch (error) {
        console.error("Error sending fetch messages", error);
        return res.status(500).json({ message: "Error fetching messages" });
    }
};

// Leave chat
exports.leaveChat = async (req, res) => {
    try {
        const { chatId } = req.body;
        await ChatSession.findByIdAndUpdate(chatId, { status: "ended" });
        res.json({ message: "Left Chat" });
    } catch (error) {
        console.error("Error leaving chat", error);
        return res.status(500).json({ message: "Error leaving chat" });
    }
};

// upgrade guest -> user later

