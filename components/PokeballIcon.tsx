"use client";

import React from "react";

interface PokeballIconProps {
  isCaught: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PokeballIcon: React.FC<PokeballIconProps> = ({
  isCaught,
  size = "md",
  className = ""
}) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-9 h-9"
  };

  const dimClass = sizeClasses[size];

  if (!isCaught) {
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${dimClass} transition-transform duration-200 group-hover:scale-110 opacity-40 hover:opacity-75 ${className}`}
      >
        <circle cx="50" cy="50" r="46" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="6" />
        <line x1="4" y1="50" x2="96" y2="50" stroke="#94a3b8" strokeWidth="6" />
        <circle cx="50" cy="50" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="6" />
        <circle cx="50" cy="50" r="7" fill="#cbd5e1" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${dimClass} transition-all duration-300 transform scale-100 hover:scale-110 drop-shadow-md ${className}`}
    >
      {/* Top Half Red */}
      <path d="M 4 50 A 46 46 0 0 1 96 50 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="6" />
      {/* Bottom Half White */}
      <path d="M 4 50 A 46 46 0 0 0 96 50 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="6" />
      {/* Center Black Line */}
      <line x1="4" y1="50" x2="96" y2="50" stroke="#1e293b" strokeWidth="6" />
      {/* Center Outer Button */}
      <circle cx="50" cy="50" r="16" fill="#1e293b" />
      {/* Center Inner White Button */}
      <circle cx="50" cy="50" r="11" fill="#ffffff" />
      {/* Center Blue/Yellow Glow Pin */}
      <circle cx="50" cy="50" r="6" fill="#3b82f6" className="animate-pulse" />
    </svg>
  );
};
