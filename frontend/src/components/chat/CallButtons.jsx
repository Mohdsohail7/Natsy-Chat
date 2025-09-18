import React from "react";
import { FiPhone, FiVideo } from "react-icons/fi";

const CallButtons = ({ onAudioCall, onVideoCall }) => {
  return (
    <div className="flex gap-3 items-center">
      {/* Audio Call */}
      <button
        onClick={onAudioCall}
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-green-400 transition"
        title="Start Audio Call"
      >
        <FiPhone size={20} />
      </button>

      {/* Video Call */}
      <button
        onClick={onVideoCall}
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-blue-400 transition"
        title="Start Video Call"
      >
        <FiVideo size={20} />
      </button>
    </div>
  );
};

export default CallButtons;
