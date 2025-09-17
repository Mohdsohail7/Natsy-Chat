import React, { useState } from "react";
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
      { id: 4, sender: "me", name: "Me", text: "What are you up to today?" },
      { id: 5, sender: "other", name: "Alice", text: "Just working on some code. It's a fun project!" },
      { id: 6, sender: "me", name: "Me", text: "That sounds cool. Anything interesting?" },
      { id: 7, sender: "other", name: "Alice", text: "Just trying to get a scrolling div to work properly. It's a bit tricky." },
      { id: 8, sender: "me", name: "Me", text: "Haha, I know the feeling. Tailwind can be a bit weird sometimes." },
      { id: 9, sender: "other", name: "Alice", text: "Definitely. So, what about you?" },
      { id: 10, sender: "me", name: "Me", text: "Oh, just enjoying the weekend. Taking a break." },
      { id: 11, sender: "other", name: "Alice", text: "Sounds relaxing. Wish I could do that." },
      { id: 12, sender: "me", name: "Me", text: "You'll get there soon. Don't worry about it." },
      { id: 13, sender: "other", name: "Alice", text: "Yeah, I hope so too." },
      { id: 14, sender: "me", name: "Me", text: "Hey, do you wanna grab some coffee later?" },
      { id: 15, sender: "other", name: "Alice", text: "Sure, that sounds great. Where should we meet?" },
      { id: 16, sender: "me", name: "Me", text: "How about that new place downtown?" },
      { id: 17, sender: "other", name: "Alice", text: "Sounds good. See you then!" },
      { id: 18, sender: "me", name: "Me", text: "See ya!" },
      { id: 19, sender: "other", name: "Alice", text: "By the way, did you see the new movie?" },
      { id: 20, sender: "me", name: "Me", text: "Which one?" },
      { id: 21, sender: "other", name: "Alice", text: "The sci-fi thriller that just came out." },
      { id: 22, sender: "me", name: "Me", text: "Oh yeah, I heard it was good. Was it?" },
      { id: 23, sender: "other", name: "Alice", text: "It was awesome! Highly recommend it." },
      { id: 24, sender: "me", name: "Me", text: "Cool, I'll check it out." },
      { id: 25, sender: "other", name: "Alice", text: "Hey, I'm almost done with my work. What time should we meet?" },
      { id: 26, sender: "me", name: "Me", text: "How about 4 PM?" },
      { id: 27, sender: "other", name: "Alice", text: "Perfect. See you at the coffee shop." },
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
    {
      id: 5,
      name: "Frank",
      status: "online",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
    {
      id: 6,
      name: "Grace",
      status: "online",
      avatar: "https://i.pravatar.cc/40?img=6",
    },
    {
      id: 7,
      name: "Heidi",
      status: "offline",
      avatar: "https://i.pravatar.cc/40?img=7",
    },
    {
      id: 8,
      name: "Ivan",
      status: "online",
      avatar: "https://i.pravatar.cc/40?img=8",
    },
    {
      id: 9,
      name: "Judy",
      status: "online",
      avatar: "https://i.pravatar.cc/40?img=9",
    },
    {
      id: 10,
      name: "Karl",
      status: "offline",
      avatar: "https://i.pravatar.cc/40?img=10",
    },
    {
      id: 11,
      name: "Laura",
      status: "online",
      avatar: "https://i.pravatar.cc/40?img=11",
    },
    {
      id: 12,
      name: "Mike",
      status: "online",
      avatar: "https://i.pravatar.cc/40?img=12",
    },
    {
      id: 13,
      name: "Nora",
      status: "online",
      avatar: "https://i.pravatar.cc/40?img=13",
    },
    {
      id: 14,
      name: "Oliver",
      status: "offline",
      avatar: "https://i.pravatar.cc/40?img=14",
    },
    {
      id: 15,
      name: "Pam",
      status: "online",
      avatar: "https://i.pravatar.cc/40?img=15",
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
        <aside className="hidden md:block w-80">
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
    </div>
  );
}
