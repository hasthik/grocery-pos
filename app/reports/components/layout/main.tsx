"use client";

import * as React from "react";

/**
 * Main layout container, typically the central content area of the page.
 */
export function Main({ children }: { children: React.ReactNode }) {
  return <main className="p-4">{children}</main>;
}
