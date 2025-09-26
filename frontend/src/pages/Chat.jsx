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
    socket.on("chatStarted", ({ chatId }) => {
      console.log("Chat started with ID:", chatId);

      localStorage.setItem("chatId", chatId);

      setChatId(chatId);
      setActiveRoom("Random Room");
      setHasRandomChat(true);
      setIsWaiting(false);

      // clear old messages
      setChatHistories({});
    });

    socket.on("waiting", () => {
      console.log("Waiting for match...");
      setChatId(null);
      setActiveRoom("Random Room");
      setHasRandomChat(true);
      setIsWaiting(true);

      // clear old messages
      setChatHistories({});
    });

    socket.on("systemMessage", (msg) => {
      console.log("System message:", msg);
      setChatHistories((prev) => ({
        ...prev,
        "Random Room": [
          ...(prev["Random Room"] || []),
          { id: Date.now(), text: msg.text, isSystem: true },
        ],
      }));
    });

    socket.on("newMessage", (msg) => {
      console.log("Received message:", msg);

      const myRefId = localStorage.getItem("refId");
      const myRole = localStorage.getItem("role") || "guest";
      // const myUsername = localStorage.getItem("username");

      const isMe = msg.sender.refId === myRefId;
      const targetRoom = "Random Room";

      let senderDisplay;

      if (msg.sender.role === "system") {
        senderDisplay = "system";
      } else if (isMe) {
        // For my own messages
        if (myRole === "guest" || msg.sender.role === "guest") {
          senderDisplay = "me"; // styling ke liye "me"
        } else {
          senderDisplay = "me"; // still "me" for alignment
        }
      } else {
        // For other user's messages
        if (myRole === "guest" || msg.sender.role === "guest") {
          senderDisplay = "anonymous";
        } else {
          senderDisplay = msg.sender.username || "Anonymous";
        }
      }

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

    socket.on("chatEnded", ({ chatId }) => {
      console.log("Chat ended:", chatId);
      setChatHistories((prev) => ({
        ...prev,
        "Random Room": [
          ...(prev["Random Room"] || []),
          { id: Date.now(), text: "Chat ended.", isSystem: true },
        ],
      }));
      setChatId(null);
      setIsWaiting(false);
    });

    return () => {
      socket.off("chatStarted");
      socket.off("waiting");
      socket.off("systemMessage");
      socket.off("newMessage");
      socket.off("chatEnded");
    };
  }, [activeRoom]);

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
      setChatId(null);
      setChatHistories({}); // clear chat when leaving
    }
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
            />
          )}
        </div>
      </div>
    </div>
  );
}
