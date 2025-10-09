import React from "react";
import { FiArrowLeft, FiUserPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import MessageBubble from "./MessageBubble";
import CallButtons from "./CallButtons";
import { sendFriendRequest } from "../../api/friends";
import { useAuth } from "../../context/AuthContext";
import socket from "../../api/socket";

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
  pendingRequestId,
  opponent,
  hasRandomChat,
  myAvatar
}) {
  const messages = chatHistories[activeRoom] || [];
  const { user } = useAuth();
  // if we’re chatting in the random room or with a temporary match
  const displayName =
    hasRandomChat || opponent?.role === "guest"
      ? "Anonymous"
      : opponent?.username || activeRoom;

  const showActionButtons = hasRandomChat && !isWaiting;

  const handleAudioCall = () => {
    console.log("Audio call started with:", activeRoom);
  };

  const handleVideoCall = () => {
    console.log("Video call started with:", activeRoom);
  };

  // Friend request handler
  const handleFriendRequest = async () => {
    if (!user || user.role === "guest") {
      // guest accounts can't send request redirect
      toast.error("Please register or login to send friend requests.");
      window.location.href = "/register";
      return;
    }

    if (!opponent || !opponent.username) {
      toast.error("Cannot send friend request: opponent not found.");
      return;
    }

    try {
      // assuming the activeRoom name is the receover's username/id
      const receiverUsername = opponent.username;
      const res = await sendFriendRequest(receiverUsername);
      toast.success(res.message || "Friend request sent!");

      // Notify receiver via socket
      socket.emit("sendFriendRequest", {
        from: user.refId,
        to: opponent.refId,
        fromUsername: user.username,
        fromAvatar: user.avatar || myAvatar,
      });

      
    } catch (error) {
      console.error(
        "Error sending friend request:",
        error.res?.data || error.message
      );
      toast.error(error.res?.data?.message || "Failed to send request.");
    }
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
        <h2 className="text-lg font-semibold">{displayName}</h2>

        {/* Call buttons */}
        <div className="ml-auto flex items-center space-x-3">
          <button
            onClick={handleFriendRequest}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
            title="Send Friend Request"
          >
            <FiUserPlus size={20} />
          </button>

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
              type={msg.type}
              from={msg.from}
              to={msg.to}
              isSender={msg.isSender}
              fromUsername={msg.fromUsername}
              fromAvatar={msg.fromAvatar}
              user={user}
              pendingRequestId={pendingRequestId}
              setChatHistories={setChatHistories}
            />
          ))
        )}
      </div>

      {/* Action buttons only visible for "Random Room" */}
      {showActionButtons && (
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
