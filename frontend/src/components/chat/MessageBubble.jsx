import React from "react";
import toast from "react-hot-toast";
import { FiUser } from "react-icons/fi";
import socket from "../../api/socket";
import { responseFriendRequest } from "../../api/friends";

export default function MessageBubble({
  sender,
  text,
  timestamp,
  isSystem,
  type,
  from,
  to,
  isSender,
  fromUsername,
  fromAvatar,
  pendingRequestId,
  setChatHistories,
  user
}) {
  // ==== System message ====
  if (isSystem) {
    return (
      <div className="w-full text-center text-gray-400 text-sm italic">
        {text}
      </div>
    );
  }

  // ==== Friend Request Card ====
  if (type === "friendRequest") {
      const handleFriendRequestRespond = async (action) => {
        try {
          const res = await responseFriendRequest(pendingRequestId, action);
          toast.success(res.message || `Friend request ${action}ed!`);
    
          if (action === "accept") {
            // Notify the sender via socket
            socket.emit("acceptFriendRequest", {
              from: user.username, // receiver
              to: pendingRequestId, // sender username or ID
            });
    
            // Add system message for receiver
            const newMessage = {
              id: Date.now(),
              sender: "system",
              text: `You and ${pendingRequestId} are now friends`,
              isSystem: true,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
            setChatHistories((prev) => ({
              ...prev,
              [pendingRequestId]: [...(prev[pendingRequestId] || []), newMessage],
            }));
          }
        } catch (error) {
          console.error(`${action} error:`, error.response?.data || error.message);
          toast.error(error.response?.data?.message || `Failed to ${action} request.`);
        }
      };

    return (
      <div className="flex flex-col items-center my-3 w-full">
        <div className="bg-gray-800 p-4 rounded-2xl shadow-md w-[90%] max-w-sm text-center">
          <div className="flex flex-col items-center mb-2">
            <img
              src={fromAvatar || `https://i.pravatar.cc/80?u=${fromUsername}`}
              alt={fromUsername}
              className="w-14 h-14 rounded-full border border-gray-700 mb-2"
            />
            <p className="text-white font-semibold">
              {fromUsername || "Unknown User"}
            </p>
          </div>

          <p className="text-gray-300 mb-3 text-sm">
            {isSender
              ? "You sent a friend request."
              : `${fromUsername} sent you a friend request.`}
          </p>

          <div className="flex justify-center gap-3">
            {/* View Profile */}
            <button
              className="bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
              onClick={() =>
                toast.success(`Viewing ${fromUsername}'s profile...`)
              }
            >
              <FiUser size={14} />
              View Profile
            </button>

            {/* Accept button (only for receiver) */}
            {!isSender ? (
              <button
                className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded-full text-sm font-medium"
                onClick={() => handleFriendRequestRespond("accept")}
              >
                Accept
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-700 text-gray-400 px-3 py-1 rounded-full text-sm font-medium cursor-not-allowed"
              >
                Sent
              </button>
            )}
          </div>

          <p className="text-[10px] text-gray-500 mt-3">
            {timestamp ||
              new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
          </p>
        </div>
      </div>
    );
  }

  // ==== Normal Chat Message ====
  const isMe = isSender;
  const senderName =
    sender === "system"
      ? ""
      : isMe
      ? "Anonymous"
      : "Anonymous"; // both sides see Anonymous until friends

  return (
    <div className={`flex flex-col mb-2 ${isMe ? "items-end" : "items-start"}`}>
      {!isSystem && !isMe && (
        <span className="text-xs text-gray-400 mb-1 ml-2">{senderName}</span>
      )}

      <div
        className={`px-4 py-2 rounded-2xl max-w-xs relative ${
          isMe
            ? "bg-indigo-500 text-white rounded-br-none"
            : "bg-gray-800 text-gray-200 rounded-bl-none"
        }`}
      >
        <p>{text}</p>
        <span className="text-[10px] text-gray-400 mt-1 block text-right">
          {timestamp ||
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </span>
      </div>
    </div>
  );
}
