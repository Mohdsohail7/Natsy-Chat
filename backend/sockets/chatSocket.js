const ChatSession = require("../models/ChatSession");
const Message = require("../models/Message");

const onlineUsers = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New User Connected.", socket.id);

    // Register user
    socket.on("registerUser", (userId) => {
      onlineUsers.set(userId, socket);
      console.log(`User ${userId} registered.`);
    });

    // Random chat
    socket.on("randomChat", async ({ role, refId, username }) => {
      try {
        // Check if someone is waiting
        let waiting = await ChatSession.findOne({ status: "waiting" });
        if (waiting) {
          // join waiting session
          const opponent = waiting.participants[0];
          waiting.participants.push({ role, refId, username });
          waiting.status = "active";
          await waiting.save();

          // Ensure both users join same room
          socket.join(waiting._id.toString());
          // Find the socket of the opponent (first user)
          const opponentSocket = [
            ...(await io.in(waiting._id.toString()).allSockets()),
          ].find((id) => id !== socket.id);

          // Notify both users that chat started
          io.to(waiting._id.toString()).emit("chatStarted", {
            chatId: waiting._id,
            opponent: opponent,
          });

          if (opponentSocket) {
            io.to(opponentSocket).emit("chatStarted", {
              chatId: waiting._id,
              opponent: { role, refId, username }, // opponent for old user
            });
          }

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

    // when user send friend request
    socket.on("friendRequest", ({ from, to }) => {
      const targetSocket = onlineUsers.get(to);
      if (targetSocket) {
        targetSocket.emit("friendRequestReceived", { from });
      } else {
        console.log(`User ${to} is not online.`);
      }
    });

    // When receiver accepts a friend request
    socket.on("friendRequestAccepted", ({ from, to }) => {
      const senderSocket = onlineUsers.get(to); // the original sender
      const receiverSocket = onlineUsers.get(from);
      if (senderSocket) {
        senderSocket.emit("friendRequestAcceptedNotification", { from });
      }
      if (receiverSocket) {
        receiverSocket.emit("friendRequestAcceptedNotification", { from: to });
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
      for (const [userId, sock] of onlineUsers.entries()) {
        if (sock === socket) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });
};
