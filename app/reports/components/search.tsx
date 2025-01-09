"use client";

import * as React from "react";
import { Input } from "@/components/ui/input"; // If you have a ShadCN `Input` component

/**
 * A simple search input with placeholder text.
 */
export function Search() {
  const [query, setQuery] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <Input
        placeholder="Search..."
        value={query}
        onChange={handleChange}
        className="w-40"
      />
    </div>
  );
}
