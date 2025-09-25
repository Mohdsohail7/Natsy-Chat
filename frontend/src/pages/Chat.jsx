import React, { useEffect, useState } from "react";
import SidebarContent from "../components/chat/SidebarContent";
import ChatScreen from "../components/chat/ChatScreen";
import socket from "../api/socket";

export default function Chat() {
  const [activeRoom, setActiveRoom] = useState(null);
  const [chatHistories, setChatHistories] = useState({});
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [hasRandomChat, setHasRandomChat] = useState(localStorage.getItem("role") === "guest");
  const [isWaiting, setIsWaiting] = useState(false);

  // Example friends list (can be fetched from API later)
  const [friends] = useState([
    { id: 1, name: "Alice", status: "online", avatar: "https://i.pravatar.cc/40?img=1" },
    { id: 2, name: "Bob", status: "offline", avatar: "https://i.pravatar.cc/40?img=2" },
    { id: 3, name: "Charlie", status: "online", avatar: "https://i.pravatar.cc/40?img=3" },
  ]);

  const myAvatar = "https://i.pravatar.cc/40?img=5";

  // ==== Socket Listeners ===
  useEffect(() => {
    socket.on("chatStarted", ({ chatId }) => {
      console.log("Chat started with ID:", chatId);
      setChatId(chatId);
      setActiveRoom("Random Room");
      setHasRandomChat(true);
      setIsWaiting(false);
    });

    socket.on("waiting", ({ chatId }) => {
      console.log("Waiting for match... session:", chatId);
      setChatId(chatId);
      setActiveRoom("Random Room");
      setHasRandomChat(true);
      setIsWaiting(true);
    });

    socket.on("newMessage", (msg) => {
      console.log("Received message:", msg);
      setChatHistories((prev) => ({
        ...prev,
        [activeRoom]: [...(prev[activeRoom] || []), {
          id: msg._id,
          sender: msg.sender,
          text: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit", minute: "2-digit"
          })
        }]
      }))
    });

    socket.on("chatEnded", ({ chatId }) => {
      console.log("Chat ended:", chatId);
      setActiveRoom(null);
      setChatId(null);
      setIsWaiting(false);
    });

    return () => {
      socket.off("chatStarted");
      socket.off("waiting");
      socket.off("newMessage");
      socket.off("chatEnded");
    };

  }, [activeRoom]);

  // ==== start random chat ====
  const startRandomChat = async (userId) => {
    const username = localStorage.getItem("username");
    if (!username) return;
    socket.emit("randomChat", { userId: username });
    setHasRandomChat(true);
  };

  // === send message ===
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !chatId) return;

    socket.emit("sendMessage", {
      chatId,
      sender: "guest",
      content: input,
    });

    setChatHistories((prev) => ({
      ...prev,
      [activeRoom]: [...(prev[activeRoom] || []), {
        id: Date.now(),
        sender: "me",
        text: input,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit", minute: '2-digit'
        })
      }]
    }));

    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-950 via-gray-900 to-slate-950 text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop layout */}
        <aside className="hidden md:block w-80">
          <SidebarContent
            friends={friends}
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
              startRandomChat={startRandomChat} // optional if needed inside ChatScreen
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
                friends={friends}
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
              startRandomChat={startRandomChat} // optional if needed inside ChatScreen
              isWaiting={isWaiting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
