import React, { useEffect, useState } from "react";
import SidebarContent from "../components/chat/SidebarContent";
import ChatScreen from "../components/chat/ChatScreen";
import socket from "../api/socket";

export default function Chat() {
  const [activeRoom, setActiveRoom] = useState(null);
  const [chatHistories, setChatHistories] = useState({});
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [hasRandomChat, setHasRandomChat] = useState(
    localStorage.getItem("role") === "guest"
  );
  const [isWaiting, setIsWaiting] = useState(false);
  const [opponent, setOpponent] = useState(null);
  const [pendingRequestId, setPendingRequestId] = useState(null);

  // Example friends list (can be fetched from API later)
  // const [friends] = useState([
  //   {
  //     id: 1,
  //     name: "Alice",
  //     status: "online",
  //     avatar: "https://i.pravatar.cc/40?img=1",
  //   },
  //   {
  //     id: 2,
  //     name: "Bob",
  //     status: "offline",
  //     avatar: "https://i.pravatar.cc/40?img=2",
  //   },
  //   {
  //     id: 3,
  //     name: "Charlie",
  //     status: "online",
  //     avatar: "https://i.pravatar.cc/40?img=3",
  //   },
  // ]);

  const myAvatar = "https://i.pravatar.cc/40?img=5";

  // ==== Socket Listeners ===
  useEffect(() => {
    const userId = localStorage.getItem("refId");
    const username = localStorage.getItem("username");
    // Register user with both id and username
    if (userId || username) {
      socket.emit("registerUser", { userId, username });
    }

    socket.on("chatStarted", ({ chatId, opponent }) => {
      console.log("Chat started with ID:", chatId);

      localStorage.setItem("chatId", chatId);

      setChatId(chatId);
      setActiveRoom(opponent.username || "Anonymous");
      setHasRandomChat(true);
      setIsWaiting(false);
      setOpponent(opponent);

      // clear old messages
      setChatHistories({});
    });

    socket.on("waiting", () => {
      console.log("Waiting for match...");
      setChatId(null);
      setActiveRoom("Random Room");
      setHasRandomChat(true);
      setIsWaiting(true);
      setOpponent(null);

      // clear old messages
      setChatHistories({});
    });

    socket.on("systemMessage", (msg) => {
      console.log("System message:", msg);
      const targetRoom = activeRoom || "Random Room";
      setChatHistories((prev) => ({
        ...prev,
        [targetRoom]: [
          ...(prev[targetRoom] || []),
          { id: Date.now(), text: msg.text, isSystem: true },
        ],
      }));
    });

    socket.on("newMessage", (msg) => {
      console.log("Received message:", msg);

      const myRefId = localStorage.getItem("refId");
      // const myRole = localStorage.getItem("role") || "guest";
      // const myUsername = localStorage.getItem("username");

      const isMe = msg.sender.refId === myRefId;
      const targetRoom = opponent?.username || "Random Room";

      let senderDisplay = "Anonymous";

      if (msg.sender.role === "system") senderDisplay = "system";
      else if (isMe) senderDisplay = "me";
      else
        senderDisplay = hasRandomChat
          ? "Anonymous"
          : msg.sender.username || "User";

      setChatHistories((prev) => ({
        ...prev,
        [targetRoom]: [
          ...(prev[targetRoom] || []),
          {
            id: msg._id || Date.now(),
            sender: senderDisplay,
            text: msg.content,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isSystem: msg.sender.role === "system",
          },
        ],
      }));
    });

    // friend request
    socket.on("friendRequestReceived", ({ from }) => {
      setChatHistories((prev) => ({
        ...prev,
        [from]: [
          ...(prev[from] || []),
          {
            id: Date.now(),
            sender: "system",
            text: `You received a friend request from ${from}`,
            isSystem: true,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
      }));
      setPendingRequestId(from);
    });

    socket.on("friendRequestAcceptedNotification", ({ from }) => {
      setChatHistories((prev) => ({
        ...prev,
        [from]: [
          ...(prev[from] || []),
          {
            id: Date.now(),
            sender: "system",
            text: `You and ${from} are now friends`,
            isSystem: true,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
      }));
    });

    socket.on("chatEnded", ({ chatId }) => {
      console.log("Chat ended:", chatId);
      const targetRoom = opponent?.username || "Random Room";
      setChatHistories((prev) => ({
        ...prev,
        [targetRoom]: [
          ...(prev[targetRoom] || []),
          { id: Date.now(), text: "Chat ended.", isSystem: true },
        ],
      }));
      setChatId(null);
      setIsWaiting(false);
      setOpponent(null);
    });

    return () => {
      socket.off("chatStarted");
      socket.off("waiting");
      socket.off("systemMessage");
      socket.off("newMessage");
      socket.off("friendRequestReceived");
      socket.off("friendRequestAcceptedNotification");
      socket.off("chatEnded");
    };
  }, [activeRoom, opponent, hasRandomChat]);

  // Role check after mount
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "guest" || role === "user") {
      setHasRandomChat(true);
    } else {
      setHasRandomChat(false);
    }
  }, []);

  // ==== start random chat ====
  const startRandomChat = async () => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role") || "guest";
    const refId = localStorage.getItem("refId");

    if (!username || !refId) {
      console.error("Missing username or refId for random chat");
      return;
    }

    // clear history when new chat requested
    setChatHistories({});

    socket.emit("randomChat", { username, role, refId });
    setHasRandomChat(true);
  };

  // === Leave chat ===
  const leaveChat = () => {
    if (chatId) {
      socket.emit("leaveChat", { chatId });
    }
    setChatId(null);
    setChatHistories({}); // clear chat when leaving
    setOpponent(null);
    setIsWaiting(false);
  };

  // === send message ===
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !chatId) return;

    const role = localStorage.getItem("role") || "guest";
    const refId = localStorage.getItem("refId");
    const username = localStorage.getItem("username");

    socket.emit("sendMessage", {
      chatId,
      sender: { role, refId, username },
      content: input,
    });

    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-950 via-gray-900 to-slate-950 text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop layout */}
        <aside className="hidden md:block w-80">
          <SidebarContent
            friends={[]}
            activeRoom={activeRoom}
            setActiveRoom={setActiveRoom}
            hasRandomChat={hasRandomChat}
            startRandomChat={startRandomChat}
          />
        </aside>

        <div className="hidden md:flex flex-1">
          {activeRoom ? (
            <ChatScreen
              activeRoom={activeRoom}
              setActiveRoom={setActiveRoom}
              chatHistories={chatHistories}
              setChatHistories={setChatHistories}
              myAvatar={myAvatar}
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              startRandomChat={startRandomChat}
              leaveChat={leaveChat}
              isWaiting={isWaiting}
              opponent={opponent}
              hasRandomChat={hasRandomChat}
              pendingRequestId={pendingRequestId}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a chat or Start Random Chat
            </div>
          )}
        </div>

        {/* Mobile layout */}
        <div className="flex md:hidden flex-1">
          {!activeRoom ? (
            <div className="w-full">
              <SidebarContent
                friends={[]}
                activeRoom={activeRoom}
                setActiveRoom={setActiveRoom}
                hasRandomChat={hasRandomChat}
                startRandomChat={startRandomChat}
              />
            </div>
          ) : (
            <ChatScreen
              activeRoom={activeRoom}
              setActiveRoom={setActiveRoom}
              chatHistories={chatHistories}
              setChatHistories={setChatHistories}
              myAvatar={myAvatar}
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              startRandomChat={startRandomChat}
              leaveChat={leaveChat}
              isWaiting={isWaiting}
              opponent={opponent}
              hasRandomChat={hasRandomChat}
              pendingRequestId={pendingRequestId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
