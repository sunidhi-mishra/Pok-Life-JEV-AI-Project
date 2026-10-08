"use client";

import React, { useState } from "react";
import { PokeballIcon, PlantDecorIcon } from "./icons/PixelIcons";
import { TrainerSpeechBubble } from "./TrainerDuo";

const EXAMPLE_PROMPTS = [
  "I'm feeling stuck in my career and don't know which path to take...",
  "I keep overthinking every decision and can't make up my mind...",
  "I'm going through a tough breakup and struggling to rebuild my routine...",
];

export function InputPanel({
  situation,
  setSituation,
  onSubmit,
  isLoading,
  error,
}: {
  situation: string;
  setSituation: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string | null;
}) {
  const charLimit = 500;
  const count = situation.length;

  return (
    <section aria-label="Input Panel" className="rpg-panel p-5 md:p-7 flex flex-col justify-between h-full min-h-[640px]">
      <div>
        {/* Step Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="rpg-badge px-2.5 py-1">
            STEP 1 / 3
          </span>
        </div>

        {/* Heading with Decorative Plant */}
        <div className="flex items-center gap-2 mb-2">
          <PlantDecorIcon className="w-6 h-6 shrink-0" />
          <h2 className="font-['Press_Start_2P',monospace] text-base md:text-lg text-[#18243c] tracking-tight">
            What&apos;s going on?
          </h2>
        </div>

        {/* Supporting Copy */}
        <p className="text-xs md:text-sm text-slate-600 font-medium mb-4 leading-relaxed">
          Tell us what&apos;s on your mind. Big or small, our trainers will figure
          out which creature might be in your corner.
        </p>

        {/* Textarea Input */}
        <div className="relative">
          <label htmlFor="user-situation-input" className="sr-only">
            Describe your situation
          </label>
          <textarea
            id="user-situation-input"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            disabled={isLoading}
            maxLength={charLimit}
            rows={6}
            placeholder="I've been studying for months, but I keep losing motivation and I'm starting to doubt myself..."
            className="w-full bg-[#f4f1e6] border-2 border-[#18243c] rounded-2xl p-4 text-xs md:text-sm text-[#18243c] placeholder:text-slate-400 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2b75d6] focus:border-[#2b75d6] shadow-inner resize-none transition"
          />
          <div className="text-right text-[11px] font-semibold text-slate-400 mt-1 mr-1">
            {count}/{charLimit}
          </div>
        </div>

        {/* Error notification banner if any */}
        {error && (
          <div className="mt-2 bg-[#ffebee] border-2 border-[#e24236] text-[#c62828] text-xs font-semibold px-3 py-2 rounded-xl flex items-center justify-between">
            <span>{error}</span>
          </div>
        )}

        {/* Example Prompt Chips */}
        <div className="mt-3">
          <p className="text-xs font-bold text-slate-700 mb-2">
            Not sure what to write? Try an example:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {EXAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSituation(prompt)}
                disabled={isLoading}
                className="rpg-btn-secondary px-3 py-2.5 rounded-xl text-left text-[11px] font-bold text-[#18243c] leading-snug hover:bg-[#e4dec8] transition h-full flex flex-col justify-center"
              >
                <span>{prompt.slice(0, 36)}...</span>
              </button>
            ))}
          </div>
        </div>

        {/* Primary CTA */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || count < 3}
            className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 select-none ${
              isLoading || count < 3
                ? "bg-slate-400 border-3 border-slate-600 text-slate-200 cursor-not-allowed opacity-80"
                : "rpg-btn-primary cursor-pointer active:translate-y-1"
            }`}
          >
            <PokeballIcon className="w-6 h-6 animate-pulse" />
            <span className="font-['Press_Start_2P',monospace] text-xs md:text-sm tracking-wider">
              {isLoading ? "SEARCHING KANTO..." : "FIND MY PARTNER →"}
            </span>
          </button>
        </div>
      </div>

      {/* Trainers Dialogue Section at Bottom */}
      <div className="mt-6 pt-4 border-t-2 border-[#18243c]/15 flex items-end justify-around gap-2">
        <TrainerSpeechBubble
          trainer="Ash"
          quote="Alright! Let's see what creature matches your story!"
        />
        <TrainerSpeechBubble
          trainer="Misty"
          quote="I'll bring a different perspective though!"
        />
      </div>
    </section>
  );
}
