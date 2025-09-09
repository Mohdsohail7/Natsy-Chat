import React, { useState } from "react";
import Footer from "../components/Footer";
import SidebarContent from "../components/chat/SidebarContent";
import ChatScreen from "../components/chat/ChatScreen";

export default function Chat() {
  const [activeRoom, setActiveRoom] = useState(null);

  // Messages per room/friend
  const [chatHistories, setChatHistories] = useState({
    "Random Room": [
      { id: 1, sender: "other", name: "Alice", text: "Hey there" },
      { id: 2, sender: "me", name: "Me", text: "Hi! How are you?" },
      { id: 3, sender: "other", name: "Alice", text: "I’m good, thanks!" },
    ],
    Alice: [{ id: 1, sender: "other", name: "Alice", text: "Hi! Long time" }],
    Bob: [{ id: 1, sender: "other", name: "Bob", text: "Yo, what’s up?" }],
    Charlie: [
      { id: 1, sender: "other", name: "Charlie", text: "Ready for the game?" },
    ],
    Diana: [{ id: 1, sender: "other", name: "Diana", text: "Hey" }],
  });

  const [input, setInput] = useState("");

  // Friends list with avatars
  const friends = [
    {
      id: 1,
      name: "Alice",
      status: "online",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: 2,
      name: "Bob",
      status: "offline",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    {
      id: 3,
      name: "Charlie",
      status: "online",
      avatar: "https://i.pravatar.cc/40?img=3",
    },
    {
      id: 4,
      name: "Diana",
      status: "offline",
      avatar: "https://i.pravatar.cc/40?img=4",
    },
  ];

  const myAvatar = "https://i.pravatar.cc/40?img=5";

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      name: "Me",
      text: input,
    };

    setChatHistories((prev) => ({
      ...prev,
      [activeRoom]: [...(prev[activeRoom] || []), newMessage],
    }));

    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-950 via-gray-900 to-slate-950 text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop layout */}
        <aside className="hidden md:block">
          <SidebarContent
            friends={friends}
            activeRoom={activeRoom}
            setActiveRoom={setActiveRoom}
          />
        </aside>
        <div className="hidden md:flex flex-1">
          {activeRoom ? (
            <ChatScreen
              activeRoom={activeRoom}
              setActiveRoom={setActiveRoom}
              chatHistories={chatHistories}
              setChatHistories={setChatHistories}
              friends={friends}
              myAvatar={myAvatar}
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a chat
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
              />
            </div>
          ) : (
            <ChatScreen
              activeRoom={activeRoom}
              setActiveRoom={setActiveRoom}
              chatHistories={chatHistories}
              setChatHistories={setChatHistories}
              friends={friends}
              myAvatar={myAvatar}
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
