"use client";

import React from "react";
import { PokeballIcon } from "./icons/PixelIcons";
import { Home, BookOpen, PawPrint, Info } from "lucide-react";

export function Header() {
  return (
    <header className="w-full max-w-7xl mx-auto pt-4 pb-2 px-4 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
      {/* Branding Box */}
      <div className="bg-[#18243c] text-white px-5 py-3 rounded-2xl border-4 border-[#10192e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] flex items-center gap-3">
        <PokeballIcon className="w-9 h-9 shrink-0 drop-shadow-sm" />
        <div>
          <h1 className="font-['Press_Start_2P',monospace] text-base md:text-xl font-bold tracking-tight text-white flex items-center gap-1">
            <span className="text-[#f7f5ed]">Poké</span>
            <span className="text-[#f1c40f]">Life</span>
          </h1>
          <p className="text-xs text-slate-300 font-medium tracking-wide mt-0.5">
            Different problems. New companions.
          </p>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav aria-label="Main Navigation">
        <div className="bg-[#18243c]/90 backdrop-blur-sm px-2 py-1.5 rounded-2xl border-4 border-[#10192e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] flex items-center gap-1 md:gap-2">
          {/* Active Item: Home */}
          <button
            type="button"
            className="flex items-center gap-2 bg-[#f7f5ed] text-[#18243c] font-bold text-xs md:text-sm px-3 md:px-4 py-2 rounded-xl shadow-[2px_2px_0px_0px_#10192e] transition hover:bg-white"
          >
            <Home className="w-4 h-4 text-[#18243c]" />
            <span>Home</span>
          </button>

          {/* Nav Item: How it works */}
          <button
            type="button"
            className="flex items-center gap-2 text-slate-300 hover:text-white font-semibold text-xs md:text-sm px-2.5 md:px-3 py-2 rounded-xl transition hover:bg-white/5"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">How it works</span>
          </button>

          {/* Nav Item: The Creatures */}
          <button
            type="button"
            className="flex items-center gap-2 text-slate-300 hover:text-white font-semibold text-xs md:text-sm px-2.5 md:px-3 py-2 rounded-xl transition hover:bg-white/5"
          >
            <PawPrint className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">The Creatures</span>
          </button>

          {/* Nav Item: About */}
          <button
            type="button"
            className="flex items-center gap-2 text-slate-300 hover:text-white font-semibold text-xs md:text-sm px-2.5 md:px-3 py-2 rounded-xl transition hover:bg-white/5"
          >
            <Info className="w-4 h-4 text-slate-400" />
            <span>About</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
