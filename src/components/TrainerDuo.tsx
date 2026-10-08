"use client";

import React from "react";
import Image from "next/image";

export function TrainerSpeechBubble({
  trainer,
  quote,
}: {
  trainer: "Ash" | "Misty";
  quote: string;
}) {
  const isAsh = trainer === "Ash";

  return (
    <div className="flex flex-col items-center">
      {/* Speech Bubble */}
      <div
        className={`relative bg-white border-2 border-[#18243c] rounded-2xl p-3 shadow-[3px_3px_0px_0px_#18243c] text-xs font-semibold text-[#18243c] leading-relaxed max-w-[210px] min-h-[64px] flex items-center justify-center text-center ${
          isAsh ? "speech-bubble-tail-ash" : "speech-bubble-tail-misty"
        }`}
      >
        <span>{quote}</span>
      </div>

      {/* Trainer Avatar without circular framing */}
      <div className="mt-2.5 flex flex-col items-center">
        <div className="relative w-20 h-24 overflow-hidden drop-shadow-md">
          <Image
            src={isAsh ? "/ash1.png" : "/misty1.png"}
            alt={isAsh ? "Ash" : "Misty"}
            fill
            sizes="80px"
            className="object-contain object-bottom"
            priority
          />
        </div>

        {/* Character Badge */}
        <div className="mt-1 bg-[#f7f5ed] border-2 border-[#18243c] px-3 py-0.5 rounded-md shadow-[2px_2px_0px_0px_#18243c]">
          <span className="font-['Press_Start_2P',monospace] text-[9px] font-bold text-[#18243c]">
            {isAsh ? "ASH" : "MISTY"}
          </span>
        </div>
      </div>
    </div>
  );
}
