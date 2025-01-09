"use client";

import * as React from "react";

/**
 * Header layout container, typically for a top navigation bar.
 * Wraps children in a header element with a simple border and padding.
 */
export function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between border-b px-4 py-2">
      {children}
    </header>
  );
}
