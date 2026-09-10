"use client";

import React from "react";

interface PokeballLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const PokeballLogo: React.FC<PokeballLogoProps> = ({
  size = "md",
  className = ""
}) => {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={`relative flex-shrink-0 ${sizeMap[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* Outer Clip Shadow / Gradient */}
        <circle cx="50" cy="50" r="48" fill="#1e293b" />
        
        {/* Top Half Red */}
        <path d="M 4 50 A 46 46 0 0 1 96 50 Z" fill="#ef4444" />
        
        {/* Top Gloss Reflection */}
        <path d="M 12 44 A 40 40 0 0 1 88 44 A 46 46 0 0 0 12 44 Z" fill="#ffffff" opacity="0.35" />
        
        {/* Bottom Half White */}
        <path d="M 4 50 A 46 46 0 0 0 96 50 Z" fill="#ffffff" />
        
        {/* Center Black Divider Band */}
        <rect x="3" y="45" width="94" height="10" fill="#1e293b" />
        
        {/* Center Button Rings */}
        <circle cx="50" cy="50" r="16" fill="#1e293b" />
        <circle cx="50" cy="50" r="11" fill="#ffffff" />
        <circle cx="50" cy="50" r="6" fill="#38bdf8" />
        <circle cx="48" cy="48" r="2" fill="#ffffff" />
      </svg>
    </div>
  );
};
