"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PokeballIcon } from "./icons/PixelIcons";
import { RotateCcw, Share2, Lightbulb, Check } from "lucide-react";
import type { MatchApiResponseSuccess } from "@/types/api";

const TYPE_COLORS: Record<string, string> = {
  Water: "bg-[#3692dc] text-white",
  Fire: "bg-[#f06535] text-white",
  Grass: "bg-[#59b54c] text-white",
  Electric: "bg-[#f3be2b] text-[#18243c]",
  Rock: "bg-[#9d8350] text-white",
  Ground: "bg-[#c89e5a] text-white",
  Poison: "bg-[#a352a1] text-white",
  Psychic: "bg-[#e55782] text-white",
  Bug: "bg-[#92a222] text-white",
  Normal: "bg-[#9da0a4] text-white",
  Ghost: "bg-[#645090] text-white",
  Fighting: "bg-[#ba332b] text-white",
  Ice: "bg-[#51c4e7] text-[#18243c]",
  Dragon: "bg-[#505fcc] text-white",
  Fairy: "bg-[#f09ad9] text-[#18243c]",
};

export function ResultPanel({
  data,
  onReset,
  isLoading,
}: {
  data: MatchApiResponseSuccess["result"] | null;
  onReset: () => void;
  isLoading: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!data) return;
    const text = `I took my situation to PokéLife and was matched with #${data.pokemon.id} ${data.pokemon.name} (${data.pokemon.archetype})! "${data.whyThisPokemon}"`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My PokéLife Partner",
          text,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // --------------------------------------------------------------------------
  // Loading State (STEP 2 / 3: Active Search Progression)
  // --------------------------------------------------------------------------
  if (isLoading) {
    return (
      <section aria-label="Loading Panel" className="rpg-panel p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-[640px]">
        <div className="flex items-center gap-2 mb-4">
          <span className="rpg-badge px-3 py-1 bg-[#1a73e8] border-[#0d47a1]">
            STEP 2 / 3
          </span>
        </div>
        <div className="relative w-28 h-28 my-4">
          <PokeballIcon className="w-28 h-28 animate-spin" />
        </div>
        <h3 className="font-['Press_Start_2P',monospace] text-sm md:text-base text-[#18243c] mt-4 mb-2">
          Searching Kanto...
        </h3>
        <p className="text-xs md:text-sm text-slate-600 max-w-xs font-semibold leading-relaxed">
          Ash &amp; Misty are evaluating your story against all 151 Pokémon across confidence, persistence, adaptability, courage, patience, and calm...
        </p>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // Empty State before search (Awaiting Step 1 completion)
  // --------------------------------------------------------------------------
  if (!data) {
    return (
      <section aria-label="Awaiting Situation Panel" className="rpg-panel p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-[640px]">
        {/* Step progression pill */}
        <div className="flex items-center gap-2 mb-4">
          <span className="rpg-badge px-3 py-1 bg-slate-600 border-slate-800 text-slate-200">
            AWAITING STEP 1
          </span>
        </div>
        <div className="w-24 h-24 rounded-full border-4 border-dashed border-[#18243c]/30 flex items-center justify-center mb-4">
          <PokeballIcon className="w-12 h-12 opacity-40" />
        </div>
        <h3 className="font-['Press_Start_2P',monospace] text-xs md:text-sm text-[#18243c]">
          YOUR MATCH WAITS
        </h3>
        <p className="text-xs text-slate-600 max-w-xs mt-2 font-medium leading-relaxed">
          Complete <strong className="text-[#18243c]">Step 1 / 3</strong> on the left, then click <strong className="text-[#e24236]">Find My Partner</strong> to trigger <strong className="text-[#18243c]">Step 2 / 3 (Searching)</strong> and unveil <strong className="text-[#18243c]">Step 3 / 3 (Your Match)</strong>!
        </p>
      </section>
    );
  }

  const { pokemon, match, ashTake, mistyTake, whyThisPokemon } = data;
  const matchPercent = Math.round(match.deterministicScore);
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <section aria-label="Result Panel" className="rpg-panel p-5 md:p-7 flex flex-col justify-between h-full min-h-[640px]">
      <div>
        {/* Top Bar: STEP 3/3 Badge + Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="rpg-badge px-2.5 py-1">
            STEP 3 / 3
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#18243c] transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Another</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#18243c] transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Share Result"}</span>
            </button>
          </div>
        </div>

        {/* YOUR MATCH Header Banner */}
        <div className="bg-[#18243c] text-white px-4 py-2.5 rounded-xl border-3 border-[#10192e] shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] flex items-center gap-2 mb-4">
          <PokeballIcon className="w-5 h-5 shrink-0" />
          <h2 className="font-['Press_Start_2P',monospace] text-xs md:text-sm tracking-wider">
            YOUR MATCH
          </h2>
        </div>

        {/* Main Pokémon Feature Box */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[#f4f1e6] border-2 border-[#18243c] rounded-2xl p-4 shadow-sm mb-4">
          {/* Pokémon Artwork Frame */}
          <div className="sm:col-span-5 relative w-full aspect-square max-w-[200px] mx-auto bg-gradient-to-b from-[#bfe3ff] to-[#e6f4ff] rounded-xl border-2 border-[#18243c] flex items-center justify-center overflow-hidden shadow-inner">
            <Image
              src={spriteUrl}
              alt={pokemon.name}
              fill
              sizes="(max-width: 640px) 180px, 200px"
              className="object-contain p-2 drop-shadow-md transition-transform hover:scale-105 duration-200"
              priority
              unoptimized
            />
          </div>

          {/* Pokémon Identity & Match Score */}
          <div className="sm:col-span-7 flex flex-col justify-center">
            <h3 className="font-['Press_Start_2P',monospace] text-base md:text-xl text-[#18243c] uppercase tracking-tight">
              {pokemon.name}
            </h3>

            {/* Types Badges */}
            <div className="flex flex-wrap gap-1.5 my-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-[#18243c] shadow-xs ${
                    TYPE_COLORS[type] || "bg-slate-500 text-white"
                  }`}
                >
                  {type}
                </span>
              ))}
            </div>

            {/* Archetype / Subtitle */}
            <p className="text-xs font-bold text-slate-700 italic">
              {pokemon.archetype}
            </p>

            {/* 78% MATCH Badge */}
            <div className="mt-3 bg-[#c7edd4] border-2 border-[#2b8252] text-[#1b5e37] rounded-xl py-1.5 px-3 flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#2b8252] w-fit">
              <span className="font-['Press_Start_2P',monospace] text-sm md:text-base font-bold">
                {matchPercent}%
              </span>
              <span className="font-['Press_Start_2P',monospace] text-[10px] tracking-wide">
                MATCH
              </span>
            </div>

            <p className="text-[11px] text-slate-600 mt-2 font-medium leading-snug">
              Based on what you told us, this Pokémon looks like your strongest match.
            </p>
          </div>
        </div>

        {/* Why this one? Box */}
        <div className="bg-white border-2 border-[#18243c] rounded-2xl p-4 shadow-[2px_2px_0px_0px_#18243c] mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
            <h4 className="font-bold text-xs md:text-sm text-[#18243c]">
              Why this one?
            </h4>
          </div>
          <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
            {whyThisPokemon}
          </p>
        </div>

        {/* Ash & Misty Perspectives Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
          {/* Trainer A (Ash) */}
          <div className="bg-[#e9f2fb] border-2 border-[#18243c] rounded-2xl p-3 shadow-[2px_2px_0px_0px_#18243c] flex flex-col justify-between">
            <div>
              <span className="inline-block bg-[#1a73e8] text-white font-['Press_Start_2P',monospace] text-[8px] px-2 py-0.5 rounded border border-[#0d47a1] mb-2">
                ASH SAYS...
              </span>
              <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                &ldquo;{ashTake}&rdquo;
              </p>
            </div>
          </div>

          {/* Trainer B (Misty) */}
          <div className="bg-[#fcedec] border-2 border-[#18243c] rounded-2xl p-3 shadow-[2px_2px_0px_0px_#18243c] flex flex-col justify-between">
            <div>
              <span className="inline-block bg-[#e24236] text-white font-['Press_Start_2P',monospace] text-[8px] px-2 py-0.5 rounded border border-[#b71c1c] mb-2">
                MISTY SAYS...
              </span>
              <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                &ldquo;{mistyTake}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
