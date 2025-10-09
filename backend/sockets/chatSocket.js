const ChatSession = require("../models/ChatSession");
const Message = require("../models/Message");

const onlineUsers = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ New user connected:", socket.id);

    // 🔹 Register user (for direct friend updates)
    socket.on("registerUser", ({ userId, username }) => {
      if (userId) onlineUsers.set(userId, socket);
      console.log(`🟢 Registered: ${userId} (${username})`);
    });

    // 🔹 Random chat logic
    socket.on("randomChat", async ({ role, refId, username }) => {
      try {
        let waiting = await ChatSession.findOne({ status: "waiting" });
        if (waiting) {
          const opponent = waiting.participants[0];
          waiting.participants.push({ role, refId, username });
          waiting.status = "active";
          await waiting.save();

          socket.join(waiting._id.toString());

          const opponentSocket = [
            ...(await io.in(waiting._id.toString()).allSockets()),
          ].find((id) => id !== socket.id);

          io.to(waiting._id.toString()).emit("chatStarted", {
            chatId: waiting._id,
            opponent,
          });

          if (opponentSocket) {
            io.to(opponentSocket).emit("chatStarted", {
              chatId: waiting._id,
              opponent: { role, refId, username },
            });
          }

          io.to(waiting._id.toString()).emit("systemMessage", {
            text: "You are now connected with a stranger!",
          });
        } else {
          const newSession = await ChatSession.create({
            participants: [{ role, refId, username }],
            status: "waiting",
          });
          socket.join(newSession._id.toString());
          socket.emit("waiting", { chatId: newSession._id });
        }
      } catch (err) {
        console.error("❌ randomChat error:", err);
        socket.emit("error", { message: "Error starting chat." });
      }
    });

    // 🔹 Send message
    socket.on("sendMessage", async ({ chatId, sender, content, type }) => {
      try {
        if (!chatId || !sender?.refId) return;
        const msg = await Message.create({ chatId, sender, content, type });
        io.to(chatId).emit("newMessage", {
          _id: msg._id,
          chatId,
          sender,
          content,
          type,
          createdAt: msg.createdAt,
        });
      } catch (err) {
        console.error("❌ sendMessage error:", err);
        socket.emit("error", { message: "Error sending message" });
      }
    });

    // 🔹 Send friend request
    socket.on("sendFriendRequest", async ({ from, to, fromUsername, fromAvatar }) => {
      try {
        const targetSocket = onlineUsers.get(to);

        const friendRequestData = {
          type: "friendRequest",
          from,
          to,
          fromUsername,
          fromAvatar,
          message: `${fromUsername} sent you a friend request.`,
          sender: { refId: from, username: fromUsername, role: "user" },
          timestamp: new Date().toISOString(),
        };

        // Receiver gets interactive friend request card
        if (targetSocket) targetSocket.emit("newMessage", friendRequestData);

        // Sender gets a confirmation card
        socket.emit("newMessage", { ...friendRequestData, isSender: true });
      } catch (err) {
        console.error("❌ sendFriendRequest error:", err);
        socket.emit("error", { message: "Could not send friend request." });
      }
    });

    // 🔹 Accept friend request
    socket.on("acceptFriendRequest", async ({ from, to }) => {
      try {
        const senderSocket = onlineUsers.get(to);     // person who sent request
        const receiverSocket = onlineUsers.get(from); // person who accepted

        const timestamp = new Date().toISOString();

        const systemMsg = {
          type: "system",
          message: "Friend request accepted. You are now friends!",
          timestamp,
        };

        // ✅ Notify both instantly
        if (senderSocket) senderSocket.emit("newMessage", systemMsg);
        if (receiverSocket) receiverSocket.emit("newMessage", systemMsg);

        // ✅ Also store system message in DB (optional but recommended)
        const session = await ChatSession.findOne({
          participants: { $all: [{ refId: from }, { refId: to }] },
        });

        if (session) {
          await Message.create({
            chatId: session._id,
            sender: { role: "system", refId: "system", username: "System" },
            content: "Friend request accepted. You are now friends!",
            type: "system",
          });
        }
      } catch (err) {
        console.error("❌ acceptFriendRequest error:", err);
      }
    });

    // 🔹 Leave chat
    socket.on("leaveChat", async ({ chatId }) => {
      await ChatSession.findByIdAndUpdate(chatId, { status: "ended" });
      io.to(chatId).emit("chatEnded", { chatId });
    });

    // 🔹 Disconnect
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
      for (const [userId, sock] of onlineUsers.entries()) {
        if (sock === socket) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });
};
