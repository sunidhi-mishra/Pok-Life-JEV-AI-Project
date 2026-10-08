import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PokeballIcon, PlantDecorIcon } from "@/components/icons/PixelIcons";
import {
  Brain,
  Cpu,
  Layers,
  ArrowRight,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  XCircle,
  Compass,
  Scale,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "How It Works - PokéLife",
  description:
    "Learn how PokéLife pairs real-world situations with Gen 1 Pokémon companions using Groq, deterministic rules, and JEV Choice.",
};

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden">
      {/* RPG Overworld Background */}
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

      {/* Content Container */}
      <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-10 md:space-y-14">
        {/* ================================================================== */}
        {/* SECTION 1 — HERO                                                   */}
        {/* ================================================================== */}
        <section
          aria-label="How It Works Hero"
          className="rpg-panel p-6 md:p-10 text-center relative overflow-hidden"
        >
          <div className="inline-flex items-center gap-2 rpg-badge px-3 py-1 mb-4">
            <PokeballIcon className="w-3.5 h-3.5 inline-block" />
            <span>FIELD GUIDE &bull; ARCHITECTURE</span>
          </div>

          <h1 className="font-['Press_Start_2P',monospace] text-xl sm:text-2xl md:text-3xl text-[#18243c] tracking-tight mb-4">
            How It Works
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-700 font-medium leading-relaxed">
            Tell PokéLife what’s going on. It turns your situation into a
            playful reflection, then finds a Pokémon companion that fits the
            moment.
          </p>

          {/* Retro subtle corner rivets */}
          <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-[#18243c]/30" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#18243c]/30" />
          <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-[#18243c]/30" />
          <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-[#18243c]/30" />
        </section>

        {/* ================================================================== */}
        {/* SECTION 2 — SIMPLE PRODUCT FLOW (4 STEPS)                          */}
        {/* ================================================================== */}
        <section aria-label="Simple Product Flow" className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <PlantDecorIcon className="w-6 h-6 shrink-0" />
            <h2 className="font-['Press_Start_2P',monospace] text-sm md:text-base text-white drop-shadow">
              THE FOUR-STEP JOURNEY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="rpg-panel p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rpg-badge px-2.5 py-0.5">STEP 01</span>
                  <span className="text-xs font-bold text-slate-500">INPUT</span>
                </div>
                <h3 className="font-bold text-base md:text-lg text-[#18243c] mb-2">
                  Tell us what’s going on
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                  Describe a situation, challenge, decision, or feeling in your
                  own words.
                </p>
              </div>

              <div className="bg-[#f4f1e6] border-2 border-[#18243c]/40 rounded-xl p-3 text-xs italic text-slate-700 font-medium">
                &ldquo;I’ve been thinking about quitting my job, but I’m not sure
                if I’m ready.&rdquo;
              </div>
            </div>

            {/* Step 2 */}
            <div className="rpg-panel p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rpg-badge px-2.5 py-0.5">STEP 02</span>
                  <span className="text-xs font-bold text-slate-500">TRAINERS</span>
                </div>
                <h3 className="font-bold text-base md:text-lg text-[#18243c] mb-2">
                  See it from two sides
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                  Ash brings an optimistic, action-oriented perspective. Misty
                  brings a practical, risk-aware perspective.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
                <div className="bg-[#eaf3ff] border border-[#2b75d6] text-[#1e5096] rounded-lg p-2 text-center">
                  <strong>ASH</strong> &bull; Momentum &amp; Courage
                </div>
                <div className="bg-[#fff1f0] border border-[#e24236] text-[#9b2118] rounded-lg p-2 text-center">
                  <strong>MISTY</strong> &bull; Grounded Reality
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rpg-panel p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rpg-badge px-2.5 py-0.5">STEP 03</span>
                  <span className="text-xs font-bold text-slate-500">SELECTION</span>
                </div>
                <h3 className="font-bold text-base md:text-lg text-[#18243c] mb-2">
                  Meet your companion
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                  PokéLife identifies the kind of support the situation calls
                  for, then selects a Pokémon from the original 151 that best fits
                  the moment.
                </p>
              </div>

              <div className="bg-[#f7f5ed] border-2 border-[#18243c]/30 rounded-xl p-2.5 flex items-center gap-3">
                <div className="relative w-12 h-12 bg-white rounded-lg border border-[#18243c] flex items-center justify-center shrink-0">
                  <Image
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                    alt="Pikachu"
                    width={40}
                    height={40}
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-[#18243c] block">
                    Original 151 Kanto Roster
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Matched to situational need, not personal diagnosis
                  </span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="rpg-panel p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rpg-badge px-2.5 py-0.5">STEP 04</span>
                  <span className="text-xs font-bold text-slate-500">TAKEAWAY</span>
                </div>
                <h3 className="font-bold text-base md:text-lg text-[#18243c] mb-2">
                  Take what helps
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                  You get a Pokémon companion, two perspectives, and a short
                  explanation of why that companion fits your situation.
                </p>
              </div>

              <Link
                href="/"
                className="rpg-btn-primary w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-['Press_Start_2P',monospace] text-white"
              >
                <span>TRY POKÉLIFE &rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 3 — “WHAT HAPPENS UNDERNEATH?” INTRODUCTION                */}
        {/* ================================================================== */}
        <section
          aria-label="Technical Overview Intro"
          className="rpg-panel p-6 md:p-8 text-center"
        >
          <span className="rpg-badge px-3 py-1 mb-2 inline-block">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="font-['Press_Start_2P',monospace] text-base sm:text-lg md:text-xl text-[#18243c] mt-2 mb-3">
            Curious what’s happening underneath?
          </h2>
          <p className="text-xs md:text-sm text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            PokéLife doesn’t ask one AI to do everything. Each part of the system
            has a different job.
          </p>
        </section>

        {/* ================================================================== */}
        {/* SECTION 4 — TECHNICAL PIPELINE NODES                               */}
        {/* ================================================================== */}
        <section aria-label="Technical Pipeline" className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#f1c40f]" />
            <h3 className="font-['Press_Start_2P',monospace] text-xs md:text-sm text-white drop-shadow">
              THE DECISION PIPELINE
            </h3>
          </div>

          <div className="space-y-3">
            {/* NODE 1: YOUR SITUATION */}
            <div className="rpg-panel p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#18243c] text-white flex items-center justify-center font-bold text-xs shrink-0 font-['Press_Start_2P',monospace]">
                  1
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm md:text-base text-[#18243c]">
                      YOUR SITUATION
                    </h4>
                    <span className="text-[10px] bg-slate-200 border border-slate-400 font-bold px-2 py-0.5 rounded text-slate-700">
                      USER INPUT
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 mt-1">
                    You describe what’s happening in natural language.
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-500 bg-[#f4f1e6] border border-[#18243c]/20 px-3 py-1.5 rounded-lg shrink-0">
                Natural Text
              </div>
            </div>

            {/* CONNECTOR */}
            <div className="flex justify-center text-slate-300">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>

            {/* NODE 2: GROQ · UNDERSTAND */}
            <div className="rpg-panel p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2b75d6] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm md:text-base text-[#18243c]">
                      GROQ &bull; UNDERSTAND
                    </h4>
                    <span className="text-[10px] bg-blue-100 border border-blue-400 font-bold px-2 py-0.5 rounded text-blue-800">
                      AI LANGUAGE
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 mt-1">
                    Groq interprets the situation and converts it into six
                    structured situational needs. These represent{" "}
                    <strong>what the situation may call for</strong>, not a
                    diagnosis or measurement of the user.
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg shrink-0">
                6 Dimensions
              </div>
            </div>

            {/* CONNECTOR */}
            <div className="flex justify-center text-slate-300">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>

            {/* NODE 3: STRUCTURED NEEDS */}
            <div className="rpg-panel p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-xl bg-[#e67e22] text-white flex items-center justify-center font-bold text-xs shrink-0 font-['Press_Start_2P',monospace]">
                  3
                </div>
                <div className="w-full">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm md:text-base text-[#18243c]">
                      STRUCTURED NEEDS
                    </h4>
                    <span className="text-[10px] bg-amber-100 border border-amber-400 font-bold px-2 py-0.5 rounded text-amber-900">
                      SCORED 1&ndash;5
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 mt-1 mb-3">
                    The natural-language situation is now represented as six
                    weighted needs, each scored from 1&ndash;5.
                  </p>

                  {/* Clean Visual representation of 6 dimensions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 bg-[#f4f1e6] border-2 border-[#18243c]/20 p-3.5 rounded-xl text-xs text-[#18243c]">
                    {[
                      { name: "Confidence", val: 4 },
                      { name: "Persistence", val: 5 },
                      { name: "Adaptability", val: 3 },
                      { name: "Courage", val: 4 },
                      { name: "Patience", val: 2 },
                      { name: "Calm", val: 3 },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className="bg-white/80 border border-[#18243c]/15 px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 shadow-xs"
                      >
                        <span className="font-semibold text-slate-700">{item.name}</span>
                        <div className="flex items-center gap-1.5">
                          {/* 5-block retro gauge */}
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((lvl) => (
                              <div
                                key={lvl}
                                className={`w-2.5 h-3.5 rounded-xs border border-[#18243c]/40 ${
                                  lvl <= item.val
                                    ? "bg-[#e24236] shadow-xs"
                                    : "bg-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-mono font-bold text-slate-800 text-[11px] w-3 text-right">
                            {item.val}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CONNECTOR */}
            <div className="flex justify-center text-slate-300">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>

            {/* NODE 4: MATCHING ENGINE */}
            <div className="rpg-panel p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#27ae60] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm md:text-base text-[#18243c]">
                      MATCHING ENGINE
                    </h4>
                    <span className="text-[10px] bg-emerald-100 border-2 border-emerald-600 font-extrabold px-2 py-0.5 rounded text-emerald-900">
                      RULE-BASED
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 mt-1">
                    Deterministic software compares those needs against Pokémon
                    archetype ratings and ranks the best candidates. This stage
                    is <strong>NOT another AI call</strong>.
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono text-emerald-900 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg shrink-0">
                151 Evaluated &bull; Top 5 Ranked
              </div>
            </div>

            {/* CONNECTOR */}
            <div className="flex justify-center text-slate-300">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>

            {/* NODE 5: TOP 5 CANDIDATES */}
            <div className="rpg-panel p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-xl bg-[#8e44ad] text-white flex items-center justify-center font-bold text-xs shrink-0 font-['Press_Start_2P',monospace]">
                  5
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm md:text-base text-[#18243c]">
                      TOP 5 CANDIDATES
                    </h4>
                    <span className="text-[10px] bg-purple-100 border border-purple-400 font-bold px-2 py-0.5 rounded text-purple-900">
                      FOCUSED SHORTLIST
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 mt-1 mb-2">
                    Only the strongest candidates move forward. This keeps the
                    final decision focused instead of asking an AI to choose from
                    all 151 Pokémon at once.
                  </p>

                  {/* Visual 5 Mini Candidates */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      { id: 4, name: "Charmander" },
                      { id: 7, name: "Squirtle" },
                      { id: 1, name: "Bulbasaur" },
                      { id: 25, name: "Pikachu" },
                      { id: 133, name: "Eevee" },
                    ].map((c) => (
                      <div
                        key={c.id}
                        className="bg-white border-2 border-[#18243c] px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold text-[#18243c] shadow-xs"
                      >
                        <span className="text-[10px] text-slate-400 font-mono">
                          #{c.id}
                        </span>
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CONNECTOR */}
            <div className="flex justify-center text-slate-300">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>

            {/* NODE 6: JEV · CHOICE */}
            <div className="rpg-panel p-5 bg-[#fffdf0] border-4 border-[#18243c] shadow-[6px_6px_0px_0px_rgba(24,36,60,0.9)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e24236] text-white flex items-center justify-center font-bold shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-['Press_Start_2P',monospace] text-xs md:text-sm text-[#18243c]">
                      JEV &bull; CHOICE
                    </h4>
                    <span className="rpg-badge px-2.5 py-0.5 bg-[#e24236] text-white border-[#18243c]">
                      STRUCTURED JUDGMENT
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 font-medium mt-1.5">
                    PokéLife gives JEV the 5 candidate cards and asks it to make
                    a structured, bounded choice considering the situational
                    strengths and blind spots.
                  </p>
                </div>
              </div>
              <div className="text-xs font-bold text-[#e24236] bg-red-50 border-2 border-[#e24236] px-3.5 py-2 rounded-xl text-center shrink-0">
                1 Companion Chosen
              </div>
            </div>

            {/* CONNECTOR */}
            <div className="flex justify-center text-slate-300">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>

            {/* NODE 7: GROQ · EXPLAIN */}
            <div className="rpg-panel p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2b75d6] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm md:text-base text-[#18243c]">
                      GROQ &bull; EXPLAIN
                    </h4>
                    <span className="text-[10px] bg-blue-100 border border-blue-400 font-bold px-2 py-0.5 rounded text-blue-800">
                      NARRATIVE SYNTHESIS
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 mt-1">
                    Once the companion is selected, Groq turns the structured
                    result into the final PokéLife experience: Ash&apos;s
                    optimistic take, Misty&apos;s practical take, and the
                    grounded &ldquo;Why this Pokémon?&rdquo; explanation.
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-600 bg-[#f4f1e6] border border-[#18243c]/20 px-3 py-1.5 rounded-lg shrink-0">
                Ash + Misty + Story
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 5 — JEV PRIMITIVES (CHOICE / SCORE / NOUL)                 */}
        {/* ================================================================== */}
        <section
          aria-label="JEV Primitives Section"
          className="rpg-panel p-6 md:p-8 space-y-6"
        >
          <div className="text-center max-w-2xl mx-auto">
            <span className="rpg-badge px-3 py-1 mb-2 inline-block">
              DECISION ENGINE
            </span>
            <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base md:text-lg text-[#18243c] mt-2 mb-2">
              Where JEV makes the decision
            </h2>
            <p className="text-xs md:text-sm text-slate-600 font-medium">
              JEV is used for structured judgment, not free-form conversation.
              PokéLife gives JEV a small set of candidate Pokémon and asks it to
              make a structured choice between them.
            </p>
            <div className="mt-3">
              <span className="inline-block bg-[#18243c] text-[#f1c40f] border-2 border-[#10192e] font-['Press_Start_2P',monospace] text-[10px] px-3 py-1.5 rounded-lg shadow-sm">
                POKÉLIFE USES: CHOICE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* PRIMITIVE 1: NOUL */}
            <div className="rpg-inner-box p-4 bg-[#fbf9f4] border-2 border-[#18243c]/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    YES / NO
                  </span>
                  <span className="text-[9px] bg-slate-200 border border-slate-300 font-bold px-2 py-0.5 rounded text-slate-600">
                    JEV CAPABILITY
                  </span>
                </div>
                <h3 className="font-['Press_Start_2P',monospace] text-xs text-[#18243c] mb-2">
                  NOUL
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Used when a system needs to decide whether something is true or
                  false.
                </p>
              </div>
              <div className="bg-[#f0ebe0] border border-[#18243c]/20 rounded-lg p-2.5 text-[11px] italic text-slate-700">
                &ldquo;Does this situation call for a Pokémon with high
                patience?&rdquo;
              </div>
            </div>

            {/* PRIMITIVE 2: SCORE */}
            <div className="rpg-inner-box p-4 bg-[#fbf9f4] border-2 border-[#18243c]/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    HOW MUCH?
                  </span>
                  <span className="text-[9px] bg-slate-200 border border-slate-300 font-bold px-2 py-0.5 rounded text-slate-600">
                    JEV CAPABILITY
                  </span>
                </div>
                <h3 className="font-['Press_Start_2P',monospace] text-xs text-[#18243c] mb-2">
                  SCORE
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Used when a system needs to evaluate something on a continuous
                  scale.
                </p>
              </div>
              <div className="bg-[#f0ebe0] border border-[#18243c]/20 rounded-lg p-2.5 text-[11px] italic text-slate-700">
                &ldquo;How strongly does this candidate fit the
                situation?&rdquo;
              </div>
            </div>

            {/* PRIMITIVE 3: CHOICE (HIGHLIGHTED) */}
            <div className="rpg-inner-box p-4 bg-[#fff9ea] border-3 border-[#e24236] shadow-[4px_4px_0px_0px_rgba(226,66,54,0.4)] flex flex-col justify-between relative">
              <div className="absolute -top-3 right-3">
                <span className="rpg-badge px-2 py-0.5 bg-[#e24236] text-white border-2 border-[#18243c] text-[9px]">
                  USED IN POKÉLIFE
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#e24236]">
                    WHICH ONE?
                  </span>
                </div>
                <h3 className="font-['Press_Start_2P',monospace] text-xs text-[#18243c] mb-2">
                  CHOICE
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed mb-3 font-medium">
                  Used when a system needs to select one option from a defined
                  set of candidates.
                </p>
              </div>
              <div className="bg-[#fff1d6] border border-[#e24236]/40 rounded-lg p-2.5 text-[11px] italic text-[#9b2118] font-semibold">
                &ldquo;Which of these Pokémon is the best fit?&rdquo;
              </div>
            </div>
          </div>

          {/* Architectural Clarification Banner */}
          <div className="bg-[#f4f1e6] border-2 border-[#18243c]/20 rounded-xl p-3 text-center text-xs text-slate-700 font-medium">
            <strong>Architecture Note:</strong> JEV supports Noul, Score, and
            Choice. PokéLife currently uses <strong>Choice</strong> for its
            final structured selection over the top 5 candidates.
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 6 — WHY NOT JUST USE ONE AI?                               */}
        {/* ================================================================== */}
        <section
          aria-label="Separation of Concerns"
          className="rpg-panel p-6 md:p-8 space-y-6"
        >
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base md:text-lg text-[#18243c] mb-2">
              Why not just use one AI for everything?
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Asking a single model to parse, filter, rank, choose, and write
              often results in ungrounded hallucination and random results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* UNDERSTAND */}
            <div className="bg-[#f7f5ed] border-2 border-[#18243c] rounded-xl p-4 text-center">
              <span className="rpg-badge px-2 py-0.5 bg-[#2b75d6] text-white">
                AI
              </span>
              <h3 className="font-bold text-sm text-[#18243c] mt-2 mb-1">
                UNDERSTAND
              </h3>
              <p className="text-xs text-slate-600">
                Natural language is messy.
              </p>
            </div>

            {/* RULES */}
            <div className="bg-[#f7f5ed] border-2 border-[#18243c] rounded-xl p-4 text-center">
              <span className="rpg-badge px-2 py-0.5 bg-[#27ae60] text-white">
                CODE
              </span>
              <h3 className="font-bold text-sm text-[#18243c] mt-2 mb-1">
                RULES
              </h3>
              <p className="text-xs text-slate-600">
                Hard constraints should be deterministic.
              </p>
            </div>

            {/* DECIDE */}
            <div className="bg-[#f7f5ed] border-2 border-[#18243c] rounded-xl p-4 text-center">
              <span className="rpg-badge px-2 py-0.5 bg-[#e24236] text-white">
                JEV
              </span>
              <h3 className="font-bold text-sm text-[#18243c] mt-2 mb-1">
                DECIDE
              </h3>
              <p className="text-xs text-slate-600">
                A constrained choice benefits from structured judgment.
              </p>
            </div>

            {/* EXPLAIN */}
            <div className="bg-[#f7f5ed] border-2 border-[#18243c] rounded-xl p-4 text-center">
              <span className="rpg-badge px-2 py-0.5 bg-[#2b75d6] text-white">
                AI
              </span>
              <h3 className="font-bold text-sm text-[#18243c] mt-2 mb-1">
                EXPLAIN
              </h3>
              <p className="text-xs text-slate-600">
                Natural language is useful again for communicating the result.
              </p>
            </div>
          </div>

          {/* Core Philosophy Callout */}
          <div className="bg-[#18243c] text-white border-3 border-[#10192e] rounded-2xl p-4 md:p-6 text-center shadow-md">
            <p className="font-['Press_Start_2P',monospace] text-xs sm:text-sm md:text-base text-[#f1c40f] leading-relaxed">
              &ldquo;The goal isn&apos;t to use more AI. It&apos;s to use the
              right kind of intelligence at each step.&rdquo;
            </p>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 7 — PRODUCT BOUNDARIES                                     */}
        {/* ================================================================== */}
        <section
          aria-label="Product Boundaries"
          className="rpg-panel p-6 md:p-8 space-y-4"
        >
          <div className="text-center mb-2">
            <h2 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-[#18243c]">
              What PokéLife is &mdash; and isn&apos;t
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* POKELIFE IS */}
            <div className="bg-[#f4f8f4] border-2 border-[#48993c]/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-[#48993c]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#2e6425]">
                  POKÉLIFE IS
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#48993c]">&bull;</span>
                  <span>A playful reflection tool</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#48993c]">&bull;</span>
                  <span>A way to look at a situation from different perspectives</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#48993c]">&bull;</span>
                  <span>An entertainment/product experiment around AI + structured decision-making</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#48993c]">&bull;</span>
                  <span>A Pokémon-inspired companion experience</span>
                </li>
              </ul>
            </div>

            {/* POKELIFE IS NOT */}
            <div className="bg-[#fff6f5] border-2 border-[#e24236]/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-[#e24236]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#9b2118]">
                  POKÉLIFE IS NOT
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#e24236]">&bull;</span>
                  <span>Therapy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#e24236]">&bull;</span>
                  <span>A diagnosis tool</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#e24236]">&bull;</span>
                  <span>Professional advice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#e24236]">&bull;</span>
                  <span>A replacement for serious decision-making</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 8 — FINAL CTA                                              */}
        {/* ================================================================== */}
        <section
          aria-label="Final Call To Action"
          className="rpg-panel p-6 md:p-8 text-center space-y-4"
        >
          <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-[#18243c]">
            Ready to meet your companion?
          </h2>
          <p className="text-xs md:text-sm text-slate-600 max-w-md mx-auto">
            Take whatever is on your mind and see what Kanto creature is in your
            corner today.
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
