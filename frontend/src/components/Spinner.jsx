import React from "react";

export default function Spinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-14 h-14 border-4 border-blue-950 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
