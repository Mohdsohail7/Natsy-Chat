// src/components/MessageBubble.jsx
import React from "react";

export default function MessageBubble({ sender, text, timestamp, isSystem }) {
  if (isSystem) {
    return (
      <div className="w-full text-center text-gray-400 text-sm italic">
        {text}
      </div>
    );
  }

  const isMe = sender === "me";
  const isAnonymous = sender === "anonymous";

  return (
    <div className={`flex flex-col mb-2 ${isMe ? "items-end" : "items-start"}`}>
      {/* Show sender name ABOVE the bubble if not me */}
      {!isMe && (
        <span className="text-xs text-gray-400 mb-1 ml-2">
          {isAnonymous ? "Anonymous" : sender}
        </span>
      )}

      {/* Bubble */}
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs relative ${
          isMe
            ? "bg-indigo-500 text-white rounded-br-none"
            : "bg-gray-800 text-gray-200 rounded-bl-none"
        }`}
      >
        <p>{text}</p>
        <span className="text-[10px] text-gray-400 mt-1 block text-right">
          {timestamp || "00:00"}
        </span>
      </div>
    </div>
  );
}
