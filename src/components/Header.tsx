"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PokeballIcon } from "./icons/PixelIcons";
import { Home, BookOpen, PawPrint, Info } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isHowItWorks = pathname === "/how-it-works";
  const isCreatures = pathname === "/creatures";
  const isAbout = pathname === "/about";

  return (
    <header className="w-full max-w-7xl mx-auto pt-4 pb-2 px-4 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
      {/* Branding Box */}
      <Link href="/" className="group focus:outline-none">
        <div className="bg-[#18243c] text-white px-5 py-3 rounded-2xl border-4 border-[#10192e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] flex items-center gap-3 transition-transform group-hover:scale-[1.01]">
          <PokeballIcon className="w-9 h-9 shrink-0 drop-shadow-sm transition-transform group-hover:rotate-12 duration-200" />
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
      </Link>

      {/* Navigation Bar */}
      <nav aria-label="Main Navigation">
        <div className="bg-[#18243c]/90 backdrop-blur-sm px-2 py-1.5 rounded-2xl border-4 border-[#10192e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] flex items-center gap-1 md:gap-2">
          {/* Item: Home */}
          <Link
            href="/"
            className={`flex items-center gap-2 font-bold text-xs md:text-sm px-3 md:px-4 py-2 rounded-xl transition ${
              isHome
                ? "bg-[#f7f5ed] text-[#18243c] shadow-[2px_2px_0px_0px_#10192e] hover:bg-white"
                : "text-slate-300 hover:text-white font-semibold hover:bg-white/5"
            }`}
          >
            <Home className={`w-4 h-4 ${isHome ? "text-[#18243c]" : "text-slate-400"}`} />
            <span>Home</span>
          </Link>

          {/* Item: How It Works */}
          <Link
            href="/how-it-works"
            className={`flex items-center gap-2 font-bold text-xs md:text-sm px-2.5 md:px-3 py-2 rounded-xl transition ${
              isHowItWorks
                ? "bg-[#f7f5ed] text-[#18243c] shadow-[2px_2px_0px_0px_#10192e] hover:bg-white"
                : "text-slate-300 hover:text-white font-semibold hover:bg-white/5"
            }`}
          >
            <BookOpen className={`w-4 h-4 ${isHowItWorks ? "text-[#18243c]" : "text-slate-400"}`} />
            <span className="hidden sm:inline">How It Works</span>
          </Link>

          {/* Nav Item: The Creatures */}
          <Link
            href="/creatures"
            className={`flex items-center gap-2 font-bold text-xs md:text-sm px-2.5 md:px-3 py-2 rounded-xl transition ${
              isCreatures
                ? "bg-[#f7f5ed] text-[#18243c] shadow-[2px_2px_0px_0px_#10192e] hover:bg-white"
                : "text-slate-300 hover:text-white font-semibold hover:bg-white/5"
            }`}
          >
            <PawPrint className={`w-4 h-4 ${isCreatures ? "text-[#18243c]" : "text-slate-400"}`} />
            <span className="hidden sm:inline">The Creatures</span>
          </Link>

          {/* Nav Item: About */}
          <Link
            href="/about"
            className={`flex items-center gap-2 font-bold text-xs md:text-sm px-2.5 md:px-3 py-2 rounded-xl transition ${
              isAbout
                ? "bg-[#f7f5ed] text-[#18243c] shadow-[2px_2px_0px_0px_#10192e] hover:bg-white"
                : "text-slate-300 hover:text-white font-semibold hover:bg-white/5"
            }`}
          >
            <Info className={`w-4 h-4 ${isAbout ? "text-[#18243c]" : "text-slate-400"}`} />
            <span>About</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
