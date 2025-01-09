"use client";

import * as React from "react";

/**
 * A simple theme switch placeholder.
 * In a real app, you might integrate with Next Themes or similar.
 */
export function ThemeSwitch() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center space-x-2 border px-2 py-1 rounded"
    >
      <span>{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}
