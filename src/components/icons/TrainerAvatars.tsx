import React from "react";

export function TrainerAshAvatar({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="32" cy="32" r="30" fill="#e9f2fb" stroke="#18243c" strokeWidth="2.5" />
      {/* Hair (Black/Dark spike) */}
      <path d="M14 36C12 28 16 18 26 15C29 12 37 12 42 16C48 18 52 26 50 36Z" fill="#222b38" />
      {/* Face skin */}
      <ellipse cx="32" cy="36" rx="14" ry="13" fill="#ffd1a4" />
      {/* Ash's iconic Red Cap */}
      <path d="M16 26C16 18 23 13 32 13C41 13 48 18 48 26Z" fill="#e24236" stroke="#18243c" strokeWidth="2" />
      {/* Cap Visor */}
      <path d="M18 26C24 24 40 24 48 26C42 29 24 29 18 26Z" fill="#ffffff" stroke="#18243c" strokeWidth="1.5" />
      {/* Pokéball mark on cap */}
      <circle cx="32" cy="20" r="3.5" fill="#ffffff" stroke="#18243c" strokeWidth="1" />
      <circle cx="32" cy="20" r="1.2" fill="#e24236" />
      {/* Eyes */}
      <ellipse cx="26" cy="35" rx="2" ry="3" fill="#18243c" />
      <ellipse cx="38" cy="35" rx="2" ry="3" fill="#18243c" />
      <circle cx="26.8" cy="34" r="0.8" fill="#ffffff" />
      <circle cx="38.8" cy="34" r="0.8" fill="#ffffff" />
      {/* Cheeks (Z markings) */}
      <path d="M22 39L24 40L22 41" stroke="#e24236" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M42 39L40 40L42 41" stroke="#e24236" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Confident Smile */}
      <path d="M28 42C30 44 34 44 36 42" stroke="#18243c" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Jacket collar */}
      <path d="M20 50C24 46 40 46 44 50V62H20Z" fill="#1a73e8" stroke="#18243c" strokeWidth="2" />
      <path d="M29 48L32 54L35 48Z" fill="#ffffff" />
    </svg>
  );
}

export function TrainerMistyAvatar({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="32" cy="32" r="30" fill="#fcedec" stroke="#18243c" strokeWidth="2.5" />
      {/* Side Ponytail (Orange) */}
      <ellipse cx="49" cy="22" rx="7" ry="10" fill="#e66826" stroke="#18243c" strokeWidth="2" transform="rotate(25 49 22)" />
      <rect x="43" y="24" width="4" height="4" fill="#3692dc" rx="1" />
      {/* Hair base */}
      <path d="M16 36C14 26 20 16 32 16C44 16 48 25 48 36C45 32 40 30 32 30C24 30 19 33 16 36Z" fill="#e66826" stroke="#18243c" strokeWidth="2" />
      {/* Face skin */}
      <ellipse cx="32" cy="36" rx="13" ry="12.5" fill="#ffd1a4" />
      {/* Front bangs */}
      <path d="M21 27C26 29 30 25 33 29C37 25 40 28 44 28" stroke="#18243c" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Eyes (Teal/Blue) */}
      <ellipse cx="26" cy="35" rx="2.5" ry="3.5" fill="#3692dc" stroke="#18243c" strokeWidth="1" />
      <ellipse cx="38" cy="35" rx="2.5" ry="3.5" fill="#3692dc" stroke="#18243c" strokeWidth="1" />
      <circle cx="27" cy="34" r="1" fill="#ffffff" />
      <circle cx="39" cy="34" r="1" fill="#ffffff" />
      {/* Blush */}
      <ellipse cx="23" cy="39" rx="2" ry="1.2" fill="#ff9999" />
      <ellipse cx="41" cy="39" rx="2" ry="1.2" fill="#ff9999" />
      {/* Sassy Smirk */}
      <path d="M29 42C31 43.5 35 43 36 41.5" stroke="#18243c" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Yellow top & suspenders */}
      <path d="M22 50C26 47 38 47 42 50V62H22Z" fill="#f8de22" stroke="#18243c" strokeWidth="2" />
      <line x1="26" y1="48" x2="26" y2="62" stroke="#ba332b" strokeWidth="2.5" />
      <line x1="38" y1="48" x2="38" y2="62" stroke="#ba332b" strokeWidth="2.5" />
    </svg>
  );
}
