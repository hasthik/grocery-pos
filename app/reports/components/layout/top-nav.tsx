"use client";

import * as React from "react";
import Link from "next/link";

// Example nav item type
interface NavItem {
  title: string;
  href: string;
  isActive: boolean;
  disabled?: boolean;
}

interface TopNavProps {
  links: NavItem[];
}

/**
 * A top navigation bar typically placed in a Header.
 * Renders a list of nav links horizontally.
 */
export function TopNav({ links }: TopNavProps) {
  return (
    <nav className="flex items-center space-x-4">
      {links.map((link, idx) => (
        <Link
          key={idx}
          href={link.disabled ? "#" : link.href}
          className={`text-sm font-medium ${
            link.isActive ? "text-blue-600" : "text-gray-600"
          } ${link.disabled ? "opacity-50 pointer-events-none" : ""}`}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
