const ChatSession = require("../models/ChatSession");
const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New User Connected.", socket.id);

    // Random chat
    socket.on("randomChat", async ({ role, refId, username }) => {
      try {
        // Check if someone is waiting
        let waiting = await ChatSession.findOne({ status: "waiting" });
        if (waiting) {
          // join waiting session
          waiting.participants.push({ role, refId, username });
          waiting.status = "active";
          await waiting.save();

          // Ensure both users join same room
          socket.join(waiting._id.toString());
          // const otherSocket = [...(await io.in(waiting._id.toString()).allSockets())];
          // console.log("[SOCKET] Users in room:", otherSocket);

          // Notify both users that chat started
          io.to(waiting._id.toString()).emit("chatStarted", {
            chatId: waiting._id,
          });

          // Send a system message to both users
          io.to(waiting._id.toString()).emit("systemMessage", {
            text: "You are now connected with a stranger!",
            chatId: waiting._id,
          });
        } else {
          // No one waiting, create new session
          const newSession = await ChatSession.create({
            participants: [{ role, refId, username }],
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
        io.to(chatId).emit("newMessage", {
          _id: msg._id,
          sender,
          content,
          createdAt: msg.createdAt,
        });
      } catch (error) {
        console.error("[SOCKET] sendMessage error:", error);
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
