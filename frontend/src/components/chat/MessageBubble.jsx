// src/components/MessageBubble.jsx
import React from "react";

export default function MessageBubble({ sender, text, timestamp }) {
  return (
    <div className={`flex ${sender === "me" ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs relative ${
          sender === "me"
            ? "bg-indigo-500 text-white rounded-br-none"
            : "bg-gray-800 text-gray-200 rounded-bl-none"
        }`}
      >
        {/* Message text */}
        <p>{text}</p>

        {/* Placeholder timestamp (hidden for now) */}
        <span className="text-[10px] text-gray-400 mt-1 block text-right">
          {timestamp || "00:00"} {/* will show real time later */}
        </span>
      </div>
    </div>
  );
}
