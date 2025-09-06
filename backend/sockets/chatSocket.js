const ChatSession = require("../models/ChatSession");
const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New User Connected.", socket.id);

    // Random chat
    socket.on("randomChat", async ({ userId }) => {
      try {
        let waiting = await ChatSession.findOne({ status: "waiting" });
        if (waiting) {
          waiting.participants.push(userId);
          waiting.status = "active";
          await waiting.save();

          socket.join(waiting._id.toString());
          io.to(waiting._id.toString()).emit("chatStarted", { chatId: waiting._id });
        } else {
          const newSession = await ChatSession.create({
            participants: [userId],
            status: "waiting",
          });

          socket.join(newSession._id.toString());
          socket.emit("waiting", { chatId: newSession._id });
        }
      } catch (error) {
        console.error("random chat error:", error);
        socket.emit("error", { message: "Error starting chat." });
      }
    });

    // Send message
    socket.on("sendMessage", async ({ chatId, sender, content }) => {
      try {
        const msg = await Message.create({ chatId, sender, content });
        io.to(chatId).emit("newMessage", msg);
      } catch (error) {
        socket.emit("error", { message: "Error sending message" });
      }
    });

    // Leave chat
    socket.on("leaveChat", async ({ chatId }) => {
      await ChatSession.findByIdAndUpdate(chatId, { status: "ended" });
      io.to(chatId).emit("chatEnded", { chatId });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected.", socket.id);
    });
  });
};
