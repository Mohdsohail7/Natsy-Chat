import React from "react";

export default function Footer() {
  return (
    <footer className="py-6 text-center text-sm bg-black bg-opacity-30 text-white">
      © {new Date().getFullYear()} Natsy Chat. All rights reserved.
    </footer>
  );
}
