import React from "react";

export default function SidebarContent({ friends, activeRoom, setActiveRoom }) {
  return (
    <div className="flex flex-col w-100 md:w-80 bg-gray-900 border-r border-gray-800 p-4 h-full">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      <ul className="space-y-2">
        {/* Room */}
        <li
          onClick={() => setActiveRoom("Random Room")}
          className={`p-2 rounded-lg cursor-pointer ${
            activeRoom === "Random Room" ? "bg-gray-800" : "hover:bg-gray-700"
          }`}
        >
          Random Room
        </li>

        {/* Friends */}
        <li>
          <h3 className="text-gray-400 text-sm mt-4 mb-2 uppercase">Friends</h3>
          <ul className="space-y-2">
            {friends.map((friend) => (
              <li
                key={friend.id}
                onClick={() => setActiveRoom(friend.name)}
                className={`p-2 flex items-center gap-3 rounded-lg cursor-pointer ${
                  activeRoom === friend.name
                    ? "bg-gray-800"
                    : "hover:bg-gray-700"
                }`}
              >
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <span>{friend.name}</span>
                </div>
                <span
                  className={`h-2 w-2 rounded-full ${
                    friend.status === "online" ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></span>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}
