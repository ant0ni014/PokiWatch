import React from "react";

interface PokedexIconProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const PokedexIcon: React.FC<PokedexIconProps> = ({
  className = "",
  size = "md"
}) => {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8"
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${dim} ${className} inline-block flex-shrink-0 drop-shadow-sm`}
    >
      {/* Red Pokédex Outer Casing */}
      <rect x="3" y="2" width="26" height="28" rx="4" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
      
      {/* Top Fold / Bevel Notch */}
      <path
        d="M3 10L14 10L18 6L29 6"
        stroke="#7F1D1D"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Main Big Blue Sensor Lens */}
      <circle cx="8.5" cy="6" r="3.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />
      <circle cx="8.5" cy="6" r="2.2" fill="#0284C7" />
      {/* Reflection highlight */}
      <circle cx="7.7" cy="5.2" r="0.9" fill="#FFFFFF" opacity="0.9" />

      {/* Three Small Indicator LEDs */}
      <circle cx="15" cy="4.5" r="1.2" fill="#EF4444" stroke="#7F1D1D" strokeWidth="0.5" />
      <circle cx="18.5" cy="4.5" r="1.2" fill="#FBBF24" stroke="#B45309" strokeWidth="0.5" />
      <circle cx="22" cy="4.5" r="1.2" fill="#34D399" stroke="#047857" strokeWidth="0.5" />

      {/* Inner Screen Bezel (Slate Gray) */}
      <rect x="6" y="13" width="20" height="13" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
      
      {/* Green LCD Display Screen */}
      <rect x="8" y="15" width="16" height="9" rx="1" fill="#86EFAC" />
      
      {/* Screen scanlines / Pokéball silhouette on screen */}
      <circle cx="16" cy="19.5" r="3" fill="none" stroke="#166534" strokeWidth="0.8" />
      <line x1="13" y1="19.5" x2="19" y2="19.5" stroke="#166534" strokeWidth="0.8" />
      <circle cx="16" cy="19.5" r="1" fill="#166534" />

      {/* Bottom Mini Buttons */}
      <rect x="6" y="27.5" width="4" height="1.5" rx="0.5" fill="#3B82F6" />
      <circle cx="13" cy="28.2" r="0.8" fill="#EF4444" />
      <circle cx="16" cy="28.2" r="0.8" fill="#E2E8F0" />
      
      {/* D-Pad Right */}
      <rect x="22" y="27" width="4" height="2" rx="0.5" fill="#475569" />
    </svg>
  );
};
