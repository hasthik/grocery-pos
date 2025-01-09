"use client";

import * as React from "react";

/**
 * A simple profile dropdown placeholder.
 * In a real project, you'd have user data, sign out, etc.
 */
export function ProfileDropdown() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="border rounded px-2 py-1"
      >
        Profile
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded border bg-white p-2 shadow">
          <div className="py-1 hover:bg-gray-100 cursor-pointer">View Profile</div>
          <div className="py-1 hover:bg-gray-100 cursor-pointer">Settings</div>
          <div className="py-1 hover:bg-gray-100 cursor-pointer">Logout</div>
        </div>
      )}
    </div>
  );
}
