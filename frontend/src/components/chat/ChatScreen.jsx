import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import MessageBubble from "./MessageBubble";

export default function ChatScreen({
  activeRoom,          // renamed from 'room'
  setActiveRoom,       // to handle back button
  chatHistories,       // object containing messages per room
  setChatHistories,    // function to update messages
  input,
  setInput,
  sendMessage,         // function from parent
}) {
  const messages = chatHistories[activeRoom] || [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Update chatHistories in parent
    setChatHistories((prev) => ({
      ...prev,
      [activeRoom]: [...(prev[activeRoom] || []), newMessage],
    }));

    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Mobile header */}
      <div className="md:hidden flex items-center bg-gray-900 border-b border-gray-800 px-4 py-3">
        <button onClick={() => setActiveRoom(null)} className="mr-3">
          <FiArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">{activeRoom}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            sender={msg.sender}
            text={msg.text}
            timestamp={msg.timestamp || "00:00"}
          />
        ))}
      </div>
      
      {/* Action buttons */}
    <div className="px-4 py-2 bg-gray-900 border-t border-gray-800 flex items-center space-x-3">
      <button
        onClick={() => {
          const newRoom = `Chat ${Object.keys(chatHistories).length + 1}`;
          setChatHistories((prev) => ({ ...prev, [newRoom]: [] }));
          setActiveRoom(newRoom);
        }}
        className="bg-indigo-500 hover:bg-indigo-400 px-5 py-2 rounded-full font-semibold"
      >
        New Chat
      </button>
      <button
        onClick={() => {
          setActiveRoom(null);
        }}
        className="bg-indigo-500 hover:bg-indigo-400 px-5 py-2 rounded-full font-semibold"
      >
        End Chat
      </button>
    </div>

      {/* Input box */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-gray-900 flex items-center space-x-3 border-t border-gray-800"
      >
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-400 px-5 py-2 rounded-full font-semibold"
        >
          Send
        </button>
      </form>
    </div>
  );
}
