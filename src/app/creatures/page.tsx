"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PokeballIcon, PlantDecorIcon } from "@/components/icons/PixelIcons";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Scale,
  Compass,
} from "lucide-react";
import pokemonData from "@/data/pokemon151.json";
import type { PokemonRecord } from "@/types/pokemon";
import {
  MATCHING_DIMENSIONS,
  type MatchingDimension,
  DIMENSION_DEFINITIONS,
} from "@/lib/matching/dimensions";

const POKEMON_LIST = pokemonData as PokemonRecord[];

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

const DIMENSION_LABELS: Record<MatchingDimension, string> = {
  confidence: "Confidence",
  persistence: "Persistence",
  adaptability: "Adaptability",
  courage: "Courage",
  patience: "Patience",
  calm: "Calm",
};

type SortOption = "id" | "name" | "strength";

function getTopDimensions(ratings: Record<MatchingDimension, number>, count = 3) {
  return (Object.entries(ratings) as [MatchingDimension, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, count);
}

function getSpriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export default function CreaturesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDimension, setSelectedDimension] = useState<MatchingDimension | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("id");
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonRecord | null>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPokemon(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter & Sort
  const filteredPokemon = useMemo(() => {
    let result = [...POKEMON_LIST];

    // Search filter: Name or Archetype
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.productInterpretation.archetype.toLowerCase().includes(q)
      );
    }

    // Dimension filter: High score (>= 4) in selected dimension
    if (selectedDimension !== "all") {
      result = result.filter(
        (p) => p.productInterpretation.dimensionRatings[selectedDimension] >= 4
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "id") return a.id - b.id;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "strength") {
        // Sort by the dominant dimension rating sum
        const sumA = Object.values(a.productInterpretation.dimensionRatings).reduce(
          (acc, v) => acc + v,
          0
        );
        const sumB = Object.values(b.productInterpretation.dimensionRatings).reduce(
          (acc, v) => acc + v,
          0
        );
        return sumB - sumA;
      }
      return 0;
    });

    return result;
  }, [searchQuery, selectedDimension, sortBy]);

  // Navigate next / prev in modal
  const handlePrevPokemon = () => {
    if (!selectedPokemon) return;
    const prevId = selectedPokemon.id === 1 ? 151 : selectedPokemon.id - 1;
    const found = POKEMON_LIST.find((p) => p.id === prevId);
    if (found) setSelectedPokemon(found);
  };

  const handleNextPokemon = () => {
    if (!selectedPokemon) return;
    const nextId = selectedPokemon.id === 151 ? 1 : selectedPokemon.id + 1;
    const found = POKEMON_LIST.find((p) => p.id === nextId);
    if (found) setSelectedPokemon(found);
  };

  const handleRandomPokemon = () => {
    const randomIndex = Math.floor(Math.random() * POKEMON_LIST.length);
    setSelectedPokemon(POKEMON_LIST[randomIndex]);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden">
      {/* RPG Background */}
      <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none">
        <Image
          src="/rpg-world-bg.png"
          alt="Pokémon RPG Overworld map background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter contrast-105"
        />
        <div className="absolute inset-0 bg-[#0f192c]/40 backdrop-blur-[0.5px]" />
      </div>

      {/* Main Header */}
      <Header />

      {/* Main Page Container */}
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* ================================================================== */}
        {/* 1. HERO SECTION                                                    */}
        {/* ================================================================== */}
        <section
          aria-label="The Creatures Hero"
          className="rpg-panel p-6 md:p-8 text-center relative overflow-hidden"
        >
          <div className="inline-flex items-center gap-2 rpg-badge px-3 py-1 mb-3">
            <PokeballIcon className="w-3.5 h-3.5 inline-block" />
            <span>KANTO COMPANION ARCHIVE &bull; 151 SPECIES</span>
          </div>

          <h1 className="font-['Press_Start_2P',monospace] text-xl sm:text-2xl md:text-3xl text-[#18243c] tracking-tight mb-3">
            THE CREATURES
          </h1>

          <p className="font-['Press_Start_2P',monospace] text-[11px] sm:text-xs text-[#e24236] uppercase tracking-wide mb-3">
            151 Pokémon. 151 ways to face a moment.
          </p>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-slate-700 font-medium leading-relaxed">
            Every Pokémon in PokéLife represents a different kind of companion.
            Explore the original 151 and discover what each one brings to the table.
          </p>

          {/* Corner Rivets */}
          <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-[#18243c]/30" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#18243c]/30" />
          <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-[#18243c]/30" />
          <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-[#18243c]/30" />
        </section>

        {/* ================================================================== */}
        {/* 2. SEARCH & FILTER CONTROLS                                       */}
        {/* ================================================================== */}
        <section
          aria-label="Search and Filter Controls"
          className="rpg-panel p-4 md:p-6 space-y-4"
        >
          {/* Top Bar: Search Input + Sorting */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <label htmlFor="creature-search-input" className="sr-only">
                Search Pokémon by name or archetype
              </label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="creature-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Pokémon or archetype (e.g. Bulbasaur, Patient Grounder)..."
                className="w-full pl-10 pr-10 py-2.5 bg-[#f4f1e6] border-2 border-[#18243c] rounded-xl text-xs sm:text-sm text-[#18243c] placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#2b75d6] focus:border-[#2b75d6] shadow-inner transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-slate-600 shrink-0" />
              <label htmlFor="sort-dropdown" className="text-xs font-bold text-slate-700 shrink-0">
                Sort:
              </label>
              <select
                id="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-[#f7f5ed] border-2 border-[#18243c] rounded-xl px-3 py-2 text-xs font-bold text-[#18243c] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#2b75d6]"
              >
                <option value="id">Pokédex Number</option>
                <option value="name">Name</option>
                <option value="strength">Strongest Dimension Fit</option>
              </select>
            </div>
          </div>

          {/* Filter Chips: All + 6 Dimensions */}
          <div className="pt-2 border-t-2 border-[#18243c]/15">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-600 mr-1 shrink-0">
                Companion Dimension:
              </span>

              <button
                type="button"
                onClick={() => setSelectedDimension("all")}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border-2 transition ${
                  selectedDimension === "all"
                    ? "bg-[#18243c] border-[#10192e] text-white shadow-xs"
                    : "bg-[#f7f5ed] border-[#18243c]/40 text-slate-700 hover:bg-white"
                }`}
              >
                ALL ({POKEMON_LIST.length})
              </button>

              {MATCHING_DIMENSIONS.map((dim) => (
                <button
                  key={dim}
                  type="button"
                  onClick={() => setSelectedDimension(dim)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border-2 transition flex items-center gap-1.5 ${
                    selectedDimension === dim
                      ? "bg-[#e24236] border-[#18243c] text-white shadow-xs"
                      : "bg-[#f7f5ed] border-[#18243c]/40 text-slate-700 hover:bg-white"
                  }`}
                >
                  <span>High {DIMENSION_LABELS[dim]}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* 3. POKÉMON GRID                                                    */}
        {/* ================================================================== */}
        <section aria-label="Creature Cards Grid" className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200 drop-shadow-sm px-1">
            <span>
              Showing {filteredPokemon.length} of {POKEMON_LIST.length} Pokémon
            </span>
            {searchQuery && (
              <span className="text-amber-300">
                Filtered by: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>

          {filteredPokemon.length === 0 ? (
            <div className="rpg-panel p-8 text-center space-y-3">
              <p className="font-['Press_Start_2P',monospace] text-xs text-[#18243c]">
                NO CREATURES FOUND
              </p>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                No Pokémon in Kanto matched your search. Try another name, archetype,
                or reset the dimension filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDimension("all");
                }}
                className="rpg-btn-secondary px-4 py-2 rounded-xl text-xs font-bold text-[#18243c]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredPokemon.map((poke) => {
                const topDims = getTopDimensions(poke.productInterpretation.dimensionRatings, 3);
                const spriteUrl = getSpriteUrl(poke.id);

                return (
                  <div
                    key={poke.id}
                    onClick={() => setSelectedPokemon(poke)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedPokemon(poke);
                      }
                    }}
                    className="rpg-panel p-3.5 flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(18,27,46,0.95)] focus:outline-none focus:ring-3 focus:ring-[#2b75d6] group"
                    aria-label={`View profile for #${poke.id} ${poke.name}`}
                  >
                    <div>
                      {/* Top: ID Badge + Category */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-['Press_Start_2P',monospace] text-[9px] font-bold text-slate-500 bg-[#f4f1e6] border border-[#18243c]/30 px-1.5 py-0.5 rounded">
                          #{String(poke.id).padStart(3, "0")}
                        </span>
                        <div className="flex gap-1">
                          {poke.canonical.types.map((t) => (
                            <span
                              key={t}
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded border border-[#18243c] ${
                                TYPE_COLORS[t] || "bg-slate-500 text-white"
                              }`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pokémon Sprite Frame */}
                      <div className="relative w-full aspect-square max-w-[140px] mx-auto bg-gradient-to-b from-[#e6f2ff] to-[#f7f5ed] rounded-xl border-2 border-[#18243c] flex items-center justify-center overflow-hidden my-2 group-hover:scale-105 transition-transform duration-200">
                        <Image
                          src={spriteUrl}
                          alt={poke.name}
                          fill
                          sizes="(max-width: 640px) 140px, 160px"
                          className="object-contain p-2 drop-shadow-sm"
                          unoptimized
                        />
                      </div>

                      {/* Name & Archetype */}
                      <h3 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#18243c] uppercase truncate mb-1">
                        {poke.name}
                      </h3>
                      <p className="font-serif italic text-xs font-semibold text-[#8b1e16] truncate mb-2">
                        {poke.productInterpretation.archetype}
                      </p>

                      {/* Top Defining Dimensions */}
                      <div className="space-y-1 bg-[#f4f1e6] border border-[#18243c]/20 rounded-lg p-2 text-[10px] text-slate-700">
                        {topDims.map(([dim, val]) => (
                          <div key={dim} className="flex items-center justify-between">
                            <span className="capitalize font-medium">{dim}</span>
                            <div className="flex items-center gap-1">
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((lvl) => (
                                  <div
                                    key={lvl}
                                    className={`w-1.5 h-2 rounded-xs border border-[#18243c]/40 ${
                                      lvl <= val ? "bg-[#e24236]" : "bg-slate-200"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-mono text-[9px] font-bold w-2.5 text-right">
                                {val}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Action Link */}
                    <div className="mt-3 pt-2 border-t border-[#18243c]/15 text-center">
                      <span className="text-[10px] font-['Press_Start_2P',monospace] font-bold text-[#2b75d6] group-hover:text-[#1e5096] inline-flex items-center gap-1">
                        <span>VIEW PROFILE</span>
                        <span>&rarr;</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================================================================== */}
        {/* 4. MODAL / CREATURE PROFILE DRAWER                                 */}
        {/* ================================================================== */}
        {selectedPokemon && (
          <div
            className="fixed inset-0 z-50 bg-[#0c1424]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setSelectedPokemon(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-pokemon-name"
          >
            <div
              className="rpg-panel bg-[#faf8f2] w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 relative shadow-2xl space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar: Close + Navigation */}
              <div className="flex items-center justify-between gap-2 border-b-2 border-[#18243c]/20 pb-3">
                <button
                  type="button"
                  onClick={() => setSelectedPokemon(null)}
                  className="rpg-btn-secondary px-3 py-1.5 rounded-lg text-xs font-bold text-[#18243c] inline-flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>BACK TO CREATURES</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevPokemon}
                    className="p-1.5 rounded-lg bg-[#f4f1e6] border-2 border-[#18243c] hover:bg-white text-[#18243c]"
                    title="Previous Pokémon"
                    aria-label="Previous Pokémon"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs font-bold text-slate-600 px-1">
                    #{String(selectedPokemon.id).padStart(3, "0")} / 151
                  </span>
                  <button
                    type="button"
                    onClick={handleNextPokemon}
                    className="p-1.5 rounded-lg bg-[#f4f1e6] border-2 border-[#18243c] hover:bg-white text-[#18243c]"
                    title="Next Pokémon"
                    aria-label="Next Pokémon"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPokemon(null)}
                    className="ml-2 p-1.5 rounded-lg text-slate-500 hover:text-slate-900"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* SECTION 9: PROFILE HEADER */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[#f4f1e6] border-2 border-[#18243c] rounded-2xl p-4">
                <div className="sm:col-span-5 relative w-full aspect-square max-w-[190px] mx-auto bg-gradient-to-b from-[#bfe3ff] to-[#e6f4ff] rounded-xl border-2 border-[#18243c] flex items-center justify-center overflow-hidden shadow-inner">
                  <Image
                    src={getSpriteUrl(selectedPokemon.id)}
                    alt={selectedPokemon.name}
                    fill
                    sizes="190px"
                    className="object-contain p-2 drop-shadow-md"
                    priority
                    unoptimized
                  />
                </div>

                <div className="sm:col-span-7 space-y-1.5 text-center sm:text-left">
                  <span className="font-['Press_Start_2P',monospace] text-[10px] font-bold text-slate-500">
                    #{String(selectedPokemon.id).padStart(3, "0")} &bull;{" "}
                    {selectedPokemon.canonical.category}
                  </span>
                  <h2
                    id="modal-pokemon-name"
                    className="font-['Press_Start_2P',monospace] text-base sm:text-lg text-[#18243c] uppercase"
                  >
                    {selectedPokemon.name}
                  </h2>
                  <p className="font-serif italic text-sm font-bold text-[#8b1e16]">
                    {selectedPokemon.productInterpretation.archetype}
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start pt-1">
                    {selectedPokemon.canonical.types.map((type) => (
                      <span
                        key={type}
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-md border border-[#18243c] ${
                          TYPE_COLORS[type] || "bg-slate-500 text-white"
                        }`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 10 & 13: WHAT IT BRINGS vs BLIND SPOT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WHAT IT BRINGS */}
                <div className="bg-[#f0f8ef] border-2 border-[#48993c]/50 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-4 h-4 text-[#48993c]" />
                    <h3 className="font-['Press_Start_2P',monospace] text-[10px] text-[#245e1d]">
                      WHAT IT BRINGS
                    </h3>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {selectedPokemon.productInterpretation.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 font-medium">
                        <span className="text-[#48993c] font-bold">&bull;</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BLIND SPOT */}
                <div className="bg-[#fff4f2] border-2 border-[#e24236]/40 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <ShieldAlert className="w-4 h-4 text-[#e24236]" />
                    <h3 className="font-['Press_Start_2P',monospace] text-[10px] text-[#9b2118]">
                      BLIND SPOT
                    </h3>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {selectedPokemon.productInterpretation.blindSpot}
                  </p>
                </div>
              </div>

              {/* SECTION 11: SIX DIMENSIONS */}
              <div className="bg-[#f7f5ed] border-2 border-[#18243c]/25 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Press_Start_2P',monospace] text-[11px] text-[#18243c]">
                    THE POKÉLIFE PROFILE
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500">
                    SCORED 1&ndash;5
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {MATCHING_DIMENSIONS.map((dim) => {
                    const score = selectedPokemon.productInterpretation.dimensionRatings[dim];
                    return (
                      <div
                        key={dim}
                        className="bg-white/80 border border-[#18243c]/15 px-3 py-1.5 rounded-lg flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-700">
                          {DIMENSION_LABELS[dim]}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((lvl) => (
                              <div
                                key={lvl}
                                className={`w-2.5 h-3.5 rounded-xs border border-[#18243c]/40 ${
                                  lvl <= score ? "bg-[#e24236]" : "bg-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-mono font-bold text-slate-800 text-[11px] w-3 text-right">
                            {score}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[10px] italic text-slate-500 pt-1">
                  These ratings describe the PokéLife companion archetype, not your
                  personality.
                </p>
              </div>

              {/* SECTION 12 & 14: WHEN THIS COMPANION FITS & IN POKÉLIFE */}
              <div className="bg-[#fffdf0] border-2 border-[#18243c]/20 rounded-xl p-4 space-y-3">
                {/* WHEN THIS COMPANION FITS */}
                <div>
                  <h3 className="font-['Press_Start_2P',monospace] text-[10px] text-[#18243c] mb-1">
                    WHEN THIS COMPANION FITS
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {selectedPokemon.name} may fit situations that call for{" "}
                    <span className="text-[#8b1e16] font-bold lowercase">
                      {selectedPokemon.productInterpretation.strengths.join(", ")}
                    </span>
                    , offering steady companionship where their archetype aligns with
                    the needs of the moment.
                  </p>
                </div>

                {/* IN POKÉLIFE */}
                <div className="pt-2 border-t border-[#18243c]/15">
                  <h3 className="font-['Press_Start_2P',monospace] text-[10px] text-[#18243c] mb-1">
                    IN POKÉLIFE
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    Your situation determines what kind of support is needed. PokéLife
                    compares those needs against these companion archetypes before
                    making the final selection.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {getTopDimensions(selectedPokemon.productInterpretation.dimensionRatings, 3).map(
                      ([dim]) => (
                        <span
                          key={dim}
                          className="rpg-badge px-2 py-0.5 bg-[#18243c] text-[#f1c40f] text-[9px] uppercase"
                        >
                          {DIMENSION_LABELS[dim]}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 17: MEET ANOTHER CREATURE (RANDOM BUTTON) */}
              <div className="pt-2 border-t border-[#18243c]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-600">
                  MEET ANOTHER CREATURE:
                </span>
                <button
                  type="button"
                  onClick={handleRandomPokemon}
                  className="rpg-btn-secondary px-4 py-2 rounded-xl text-xs font-bold text-[#18243c] inline-flex items-center gap-2 hover:bg-[#e4dec8] transition"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>RANDOM CREATURE</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* 5. FINAL PAGE CTA                                                  */}
        {/* ================================================================== */}
        <section
          aria-label="Final Creatures Call To Action"
          className="rpg-panel p-6 md:p-8 text-center space-y-4"
        >
          <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-[#18243c]">
            FOUND A COMPANION YOU LIKE?
          </h2>
          <p className="text-xs md:text-sm text-slate-600 max-w-md mx-auto font-medium">
            See what PokéLife would choose for your situation.
          </p>
          <div className="pt-2 max-w-xs mx-auto">
            <Link
              href="/"
              className="rpg-btn-primary w-full py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 text-xs md:text-sm font-['Press_Start_2P',monospace] text-white shadow-lg active:translate-y-1"
            >
              <PokeballIcon className="w-5 h-5 animate-pulse" />
              <span>FIND MY PARTNER &rarr;</span>
            </Link>
          </div>
        </section>
      </div>

      {/* Subtle Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-3 text-center text-[11px] font-semibold text-slate-200 drop-shadow-sm select-none">
        PokéLife &bull; A playful AI reflection &amp; companion matching experience &bull; Original 151 Kanto Pokémon
      </footer>
    </main>
  );
}
