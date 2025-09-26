import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import MessageBubble from "./MessageBubble";
import CallButtons from "./CallButtons";

export default function ChatScreen({
  activeRoom, // renamed from 'room'
  setActiveRoom, // to handle back button
  chatHistories, // object containing messages per room
  setChatHistories, // function to update messages
  input,
  setInput,
  sendMessage, // function from parent
  isWaiting,
  startRandomChat,
  leaveChat,
}) {
  const messages = chatHistories[activeRoom] || [];

  const handleAudioCall = () => {
    console.log("Audio call started with:", activeRoom);
  };

  const handleVideoCall = () => {
    console.log("Video call started with:", activeRoom);
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Responsive header for both mobile & desktop */}
      <div className="flex items-center bg-gray-900 border-b border-gray-800 px-4 py-3">
        {/* Back button visible on all screen sizes */}
        <button
          onClick={() => setActiveRoom(null)}
          className="mr-3 p-1 rounded hover:bg-gray-800 transition"
        >
          <FiArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">{activeRoom}</h2>

        {/* Call buttons */}
        <div className="ml-auto">
          <CallButtons
            onAudioCall={handleAudioCall}
            onVideoCall={handleVideoCall}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {isWaiting ? (
          <div className="text-gray-400 text-center mt-10">
            Waiting for a random match...
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              sender={msg.sender}
              text={msg.text}
              timestamp={msg.timestamp || "00:00"}
              isSystem={msg.isSystem}
            />
          ))
        )}
      </div>

      {/* Action buttons only visible for "Random Room" */}
      {activeRoom === "Random Room" && (
        <div className="px-4 py-2 bg-gray-900 border-t border-gray-800 flex items-center space-x-3">
          <button
            onClick={() => {
              leaveChat();
              setChatHistories({});
              startRandomChat();
            }}
            className="bg-indigo-500 hover:bg-indigo-400 px-5 py-2 rounded-full font-semibold"
          >
            New Chat
          </button>
          <button
            onClick={() => {
              leaveChat();
              setChatHistories({});
              setActiveRoom("Random Room");
            }}
            className="bg-indigo-500 hover:bg-indigo-400 px-5 py-2 rounded-full font-semibold"
          >
            End Chat
          </button>
        </div>
      )}

      {/* Input box */}
      <form
        onSubmit={sendMessage}
        className="p-4 bg-gray-900 flex items-center space-x-3 border-t border-gray-800 sticky bottom-0"
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
