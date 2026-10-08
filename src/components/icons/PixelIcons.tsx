import React from "react";

export function PokeballIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="14" fill="#ffffff" stroke="#18243c" strokeWidth="3" />
      <path
        d="M2 16C2 8.26801 8.26801 2 16 2C23.732 2 30 8.26801 30 16H2Z"
        fill="#E24236"
      />
      <line x1="2" y1="16" x2="30" y2="16" stroke="#18243c" strokeWidth="3" />
      <circle cx="16" cy="16" r="5" fill="#ffffff" stroke="#18243c" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="2.2" fill="#faf8f2" />
    </svg>
  );
}

export function PlantDecorIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22V13M12 13C12 7.5 7.5 4 4 5C4 9.5 7.5 13 12 13ZM12 13C12 7.5 16.5 4 20 5C20 9.5 16.5 13 12 13Z"
        stroke="#48993c"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#66c058"
      />
    </svg>
  );
}
