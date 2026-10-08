import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PokeballIcon, PlantDecorIcon } from "@/components/icons/PixelIcons";
import {
  Compass,
  Scale,
  Brain,
  Cpu,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

export const metadata = {
  title: "About - PokéLife",
  description:
    "Why PokéLife exists, our situation-first philosophy, and how we pair life moments with original 151 Pokémon companions.",
};

export default function AboutPage() {
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
      <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-10 md:space-y-12">
        {/* ================================================================== */}
        {/* SECTION 2 — HERO                                                   */}
        {/* ================================================================== */}
        <section
          aria-label="About PokéLife Hero"
          className="rpg-panel p-6 md:p-10 text-center relative overflow-hidden"
        >
          <div className="inline-flex items-center gap-2 rpg-badge px-3 py-1 mb-3">
            <PokeballIcon className="w-3.5 h-3.5 inline-block" />
            <span>ABOUT POKÉLIFE</span>
          </div>

          <h1 className="font-['Press_Start_2P',monospace] text-base sm:text-xl md:text-2xl text-[#18243c] tracking-tight mb-4 leading-relaxed">
            A different way to look at what&apos;s going on.
          </h1>

          <p className="max-w-xl mx-auto text-xs sm:text-sm md:text-base text-slate-700 font-medium leading-relaxed">
            Sometimes you don&apos;t need another answer. You need another way
            to look at the situation.
          </p>

          {/* Corner Rivets */}
          <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-[#18243c]/30" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#18243c]/30" />
          <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-[#18243c]/30" />
          <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-[#18243c]/30" />
        </section>

        {/* ================================================================== */}
        {/* SECTION 3 — WHY POKÉLIFE EXISTS                                    */}
        {/* ================================================================== */}
        <section aria-label="Why PokéLife Exists" className="rpg-panel p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <PlantDecorIcon className="w-6 h-6 shrink-0" />
            <h2 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-[#18243c]">
              WHY POKÉLIFE EXISTS
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
            Real situations are rarely one-dimensional.
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A situation can call for action, patience, courage, caution, persistence,
            adaptability, or calm. But people often look at a difficult dilemma from
            only one perspective.
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            PokéLife creates a playful way to introduce different perspectives and
            pair you with a companion that represents what the moment may call for.
          </p>
        </section>

        {/* ================================================================== */}
        {/* SECTION 4 — THREE WAYS TO LOOK AT A MOMENT                         */}
        {/* ================================================================== */}
        <section aria-label="Three Ways To Look At A Moment" className="space-y-4">
          <div className="text-center">
            <h2 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm md:text-base text-white drop-shadow">
              THREE WAYS TO LOOK AT A MOMENT
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CARD 1: ASH */}
            <div className="rpg-panel p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-['Press_Start_2P',monospace] text-[10px] text-[#2b75d6]">
                    ASH
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">
                    ACTION
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#18243c] mb-2">
                  What could you do next?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  An optimistic, action-oriented perspective that asks: what could you
                  do next?
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#18243c]/15 text-[11px] font-semibold text-slate-500">
                Focus &bull; Momentum &amp; Growth
              </div>
            </div>

            {/* CARD 2: MISTY */}
            <div className="rpg-panel p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-['Press_Start_2P',monospace] text-[10px] text-[#e24236]">
                    MISTY
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">
                    CAUTION
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#18243c] mb-2">
                  What should you think through?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A practical, risk-aware perspective that asks: what should you think
                  through first?
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#18243c]/15 text-[11px] font-semibold text-slate-500">
                Focus &bull; Boundaries &amp; Reality
              </div>
            </div>

            {/* CARD 3: COMPANION */}
            <div className="rpg-panel p-5 flex flex-col justify-between bg-[#fffef5]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-['Press_Start_2P',monospace] text-[10px] text-[#27ae60]">
                    COMPANION
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    FIT
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#18243c] mb-2">
                  What fits the moment?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A Pokémon selected for the kind of support the situation may call
                  for.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#18243c]/15 text-[11px] font-semibold text-slate-500">
                Focus &bull; Archetype Alignment
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 5 — THE KEY PRODUCT PRINCIPLE                              */}
        {/* ================================================================== */}
        <section
          aria-label="Core Product Principle"
          className="rpg-panel p-6 sm:p-8 md:p-10 text-center bg-[#fdfbf5] border-4 border-[#18243c] shadow-[6px_6px_0px_0px_rgba(24,36,60,0.9)] space-y-4"
        >
          <div className="inline-block bg-[#18243c] text-slate-300 text-[10px] font-['Press_Start_2P',monospace] px-3 py-1 rounded">
            NOT &ldquo;WHICH POKÉMON ARE YOU?&rdquo;
          </div>

          <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-lg md:text-xl text-[#e24236] leading-relaxed tracking-tight max-w-xl mx-auto">
            &ldquo;WHICH COMPANION FITS THIS MOMENT?&rdquo;
          </h2>

          <div className="inline-block bg-[#f4f1e6] border-2 border-[#18243c] px-3.5 py-1.5 rounded-xl font-bold text-xs text-[#18243c]">
            PokéLife is situation-first, not personality-first.
          </div>

          <p className="max-w-lg mx-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
            The matching system looks at what a situation may call for rather than
            trying to diagnose, label, or define the person describing it.
          </p>

          {/* Retro RPG Dialogue Box Prompt Accent */}
          <div className="mt-4 bg-[#18243c] text-white border-2 border-[#10192e] rounded-xl p-3.5 max-w-md mx-auto text-left font-mono text-[11px] space-y-1">
            <div className="text-slate-400">&gt; WHAT ARE YOU LOOKING FOR?</div>
            <div className="text-[#f1c40f]">&gt; Another perspective</div>
            <div className="text-slate-200">&gt; A little courage</div>
            <div className="text-slate-200">&gt; A calmer way forward</div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 6 — BUILT WITH INTENTION                                  */}
        {/* ================================================================== */}
        <section aria-label="Built with Intention" className="space-y-4">
          <div className="text-center">
            <h2 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm md:text-base text-white drop-shadow">
              BUILT WITH INTENTION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 01 · LANGUAGE */}
            <div className="rpg-panel p-5 space-y-2">
              <span className="rpg-badge px-2 py-0.5 text-[9px] bg-[#2b75d6] text-white">
                01 &bull; LANGUAGE
              </span>
              <h3 className="font-bold text-sm text-[#18243c] pt-1">
                AI where language needs interpretation.
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Natural-language situations are interpreted by an LLM because people
                don&apos;t naturally describe their problems as structured data.
              </p>
            </div>

            {/* 02 · RULES */}
            <div className="rpg-panel p-5 space-y-2">
              <span className="rpg-badge px-2 py-0.5 text-[9px] bg-[#27ae60] text-white">
                02 &bull; RULES
              </span>
              <h3 className="font-bold text-sm text-[#18243c] pt-1">
                Code where rules should stay deterministic.
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hard constraints, candidate filtering, Pokémon data, and matching
                calculations are handled by deterministic software.
              </p>
            </div>

            {/* 03 · JUDGMENT */}
            <div className="rpg-panel p-5 space-y-2">
              <span className="rpg-badge px-2 py-0.5 text-[9px] bg-[#e24236] text-white">
                03 &bull; JUDGMENT
              </span>
              <h3 className="font-bold text-sm text-[#18243c] pt-1">
                JEV where structured judgment helps.
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                JEV makes the final structured choice from a small set of candidates
                instead of generating the entire experience as free-form text.
              </p>
            </div>
          </div>

          {/* Compact Architecture Summary Flow */}
          <div className="rpg-panel p-4 bg-[#fbf9f4] border-2 border-[#18243c]/30 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono text-xs font-bold text-[#18243c]">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase">Understand</span>
                <span className="bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded text-[11px] mt-0.5">Groq</span>
              </div>
              <span className="text-slate-400">&rarr;</span>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase">Filter</span>
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[11px] mt-0.5">Code</span>
              </div>
              <span className="text-slate-400">&rarr;</span>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase">Decide</span>
                <span className="bg-red-100 text-red-900 border border-red-300 px-2 py-0.5 rounded text-[11px] mt-0.5">JEV</span>
              </div>
              <span className="text-slate-400">&rarr;</span>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase">Explain</span>
                <span className="bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded text-[11px] mt-0.5">Groq</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 8 & 9 — WHAT POKÉLIFE IS & IS NOT                          */}
        {/* ================================================================== */}
        <section aria-label="What PokéLife Is and Is Not" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* POKELIFE IS */}
            <div className="rpg-panel p-5 sm:p-6 space-y-3 bg-[#f7faf7] border-2 border-[#48993c]/40">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-[#48993c]" />
                <h2 className="font-['Press_Start_2P',monospace] text-xs text-[#245e1d]">
                  POKÉLIFE IS
                </h2>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#48993c] font-bold">&bull;</span>
                  <div>
                    <strong className="text-[#18243c]">PLAYFUL:</strong> A lightweight
                    way to explore a situation without taking itself too seriously.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#48993c] font-bold">&bull;</span>
                  <div>
                    <strong className="text-[#18243c]">REFLECTIVE:</strong> A way to
                    consider another perspective before deciding what to do.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#48993c] font-bold">&bull;</span>
                  <div>
                    <strong className="text-[#18243c]">SITUATION-FIRST:</strong> The
                    companion is matched to the moment, not used as a personality label.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#48993c] font-bold">&bull;</span>
                  <div>
                    <strong className="text-[#18243c]">EXPERIMENTAL:</strong> A product
                    experiment exploring how structured AI systems can make playful
                    experiences more interesting.
                  </div>
                </li>
              </ul>
            </div>

            {/* POKELIFE IS NOT */}
            <div className="rpg-panel p-5 sm:p-6 space-y-3 bg-[#fff8f7] border-2 border-[#e24236]/40">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-[#e24236]" />
                <h2 className="font-['Press_Start_2P',monospace] text-xs text-[#9b2118]">
                  POKÉLIFE IS NOT
                </h2>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#e24236] font-bold">&bull;</span>
                  <div>
                    <strong className="text-[#18243c]">NOT THERAPY:</strong> PokéLife
                    is not a mental-health or therapy product.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#e24236] font-bold">&bull;</span>
                  <div>
                    <strong className="text-[#18243c]">NOT A DIAGNOSIS:</strong> It
                    does not diagnose, profile, or clinically assess users.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#e24236] font-bold">&bull;</span>
                  <div>
                    <strong className="text-[#18243c]">NOT PROFESSIONAL ADVICE:</strong> It
                    should not be used as a substitute for professional, financial,
                    medical, legal, or other expert advice.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#e24236] font-bold">&bull;</span>
                  <div>
                    <strong className="text-[#18243c]">NOT A DECISION MAKER:</strong> The
                    product offers perspectives and a playful companion. The user
                    remains responsible for real-world decisions.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 10 — THE ORIGINAL 151                                      */}
        {/* ================================================================== */}
        <section aria-label="Why The Original 151" className="rpg-panel p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <PokeballIcon className="w-5 h-5" />
            <h2 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-[#18243c]">
              WHY THE ORIGINAL 151?
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            PokéLife starts with the original 151 Pokémon and gives each one a distinct
            companion archetype.
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Each creature has its own strengths, blind spot, and six-dimensional
            profile inside the PokéLife system.
          </p>

          <div className="pt-2">
            <Link
              href="/creatures"
              className="rpg-btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold text-[#18243c] inline-flex items-center gap-2 hover:bg-[#e4dec8] transition"
            >
              <span>EXPLORE THE CREATURES</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 11 — THE PRODUCT PHILOSOPHY                                */}
        {/* ================================================================== */}
        <section
          aria-label="The Product Philosophy"
          className="p-6 sm:p-8 md:p-10 text-center !bg-[#18243c] text-white border-4 border-[#10192e] shadow-[6px_6px_0px_0px_rgba(24,36,60,0.9)] rounded-[20px] space-y-4"
        >
          <span className="text-[11px] font-['Press_Start_2P',monospace] text-[#f1c40f] uppercase tracking-wider inline-block bg-[#10192e] px-3 py-1 rounded-md border border-[#f1c40f]/30">
            THE IDEA IN ONE LINE
          </span>

          <h2 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm md:text-base text-white leading-loose max-w-2xl mx-auto drop-shadow-sm">
            Use AI where judgment helps. Use rules where certainty matters. Keep the
            experience playful.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            That&apos;s the idea behind PokéLife.
          </p>
        </section>

        {/* ================================================================== */}
        {/* SECTION 12 — FINAL CTA                                             */}
        {/* ================================================================== */}
        <section
          aria-label="Final Call To Action"
          className="rpg-panel p-6 md:p-8 text-center space-y-4"
        >
          <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-[#18243c]">
            SO, WHAT&apos;S GOING ON?
          </h2>

          <p className="text-xs md:text-sm text-slate-600 max-w-md mx-auto">
            Tell PokéLife what&apos;s on your mind and see which companion fits the
            moment.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/"
              className="rpg-btn-primary w-full sm:w-auto py-3 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs font-['Press_Start_2P',monospace] text-white shadow-md active:translate-y-1"
            >
              <PokeballIcon className="w-4 h-4 animate-pulse" />
              <span>FIND MY PARTNER &rarr;</span>
            </Link>

            <Link
              href="/creatures"
              className="rpg-btn-secondary w-full sm:w-auto py-3 px-5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-[#18243c] hover:bg-[#e4dec8] transition"
            >
              <span>EXPLORE CREATURES</span>
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
