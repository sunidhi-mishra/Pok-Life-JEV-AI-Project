"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PokeballIcon } from "./icons/PixelIcons";
import {
  X,
  Copy,
  Share2,
  Download,
  Check,
  Sparkles,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import type { MatchApiResponseSuccess } from "@/types/api";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: MatchApiResponseSuccess["result"];
}

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

export function ShareModal({ isOpen, onClose, result }: ShareModalProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const { pokemon, match, ashTake, mistyTake, whyThisPokemon } = result;
  const matchPercent = Math.round(match.deterministicScore);
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  // Detect Web Share API support
  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanNativeShare(true);
    }
  }, []);

  // Keyboard navigation: Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  /**
   * Safe share text generation — strictly excludes user situation, dimension weights,
   * internal scores, prompts, or API metadata.
   */
  const getSafeShareText = () => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://pokelife.app";

    return [
      `My PokéLife Partner is #${String(pokemon.id).padStart(3, "0")} ${pokemon.name} 🟢`,
      "",
      `Archetype: ${pokemon.archetype}`,
      `Match: ${matchPercent}%`,
      "",
      "Ash:",
      `"${ashTake}"`,
      "",
      "Misty:",
      `"${mistyTake}"`,
      "",
      "Why this Pokémon:",
      `"${whyThisPokemon}"`,
      "",
      `Try PokéLife:`,
      origin,
    ].join("\n");
  };

  /**
   * Action 1: COPY RESULT
   */
  const handleCopyResult = async () => {
    try {
      const text = getSafeShareText();
      await navigator.clipboard.writeText(text);
      showToast("RESULT COPIED!");
    } catch {
      // Fallback for older browsers or permission blocks
      const textArea = document.createElement("textarea");
      textArea.value = getSafeShareText();
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        showToast("RESULT COPIED!");
      } catch {
        showToast("COPY FAILED");
      }
      document.body.removeChild(textArea);
    }
  };

  /**
   * Action 2: SHARE (Native Web Share API with safe fallback)
   */
  const handleNativeShare = async () => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://pokelife.app";

    const shareData = {
      title: `My PokéLife Partner is ${pokemon.name}`,
      text: `PokéLife matched me with ${pokemon.name}, the ${pokemon.archetype} (${matchPercent}% match)!\n\n"${whyThisPokemon}"\n\nAsh: "${ashTake}"\nMisty: "${mistyTake}"`,
      url: origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: unknown) {
        // User aborted share sheet or cancelled
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        // Fallback to copy if native share errored
        await handleCopyResult();
      }
    } else {
      // Fallback if unavailable
      await handleCopyResult();
    }
  };

  /**
   * Action 3: SAVE RESULT CARD
   * Draws a collectible retro RPG card using HTML5 Canvas with PokéLife styling tokens.
   * Completely self-contained: no external HTML-rendering dependencies required.
   */
  const handleSaveResultCard = async () => {
    setIsGeneratingCard(true);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");

      // High-resolution canvas dimensions (retina 2x scale for sharp output)
      const W = 640;
      const H = 840;
      canvas.width = W;
      canvas.height = H;

      // Helper: Draw rounded rectangle
      const drawRoundRect = (
        x: number,
        y: number,
        w: number,
        h: number,
        r: number,
        fill: string,
        stroke?: string,
        strokeW = 2
      ) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        if (stroke) {
          ctx.lineWidth = strokeW;
          ctx.strokeStyle = stroke;
          ctx.stroke();
        }
      };

      // Helper: Word wrap text on canvas
      const wrapText = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number,
        maxLines = 4
      ): number => {
        const words = text.split(" ");
        let line = "";
        let currentY = y;
        let lineCount = 0;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            lineCount++;
            if (lineCount >= maxLines) {
              ctx.fillText(line.trim() + "...", x, currentY);
              return currentY + lineHeight;
            }
            ctx.fillText(line.trim(), x, currentY);
            line = words[n] + " ";
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line.trim(), x, currentY);
        return currentY + lineHeight;
      };

      // 1. Outer Dark RPG Background & Border
      ctx.fillStyle = "#1a2744";
      ctx.fillRect(0, 0, W, H);

      // 2. Card Shadow and Main Panel (#faf8f2 with #18243c border)
      drawRoundRect(28, 28, W - 48, H - 48, 24, "#121b2e"); // Shadow
      drawRoundRect(20, 20, W - 48, H - 48, 24, "#faf8f2", "#18243c", 5); // Outer frame

      // 3. Top Banner: PokéLife RPG Header
      drawRoundRect(40, 40, W - 88, 56, 14, "#18243c", "#10192e", 3);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("★ POKÉLIFE COMPANION CARD ★", W / 2, 68);

      // 4. Subtitle: YOUR PARTNER
      ctx.fillStyle = "#718096";
      ctx.font = "bold 12px monospace";
      ctx.fillText(`NO. #${String(pokemon.id).padStart(3, "0")} • ${pokemon.category.toUpperCase()}`, W / 2, 120);

      // 5. Pokémon Artwork Box with Gradient
      const artBoxX = (W - 240) / 2;
      const artBoxY = 140;
      const artBoxSize = 240;

      const gradient = ctx.createLinearGradient(artBoxX, artBoxY, artBoxX, artBoxY + artBoxSize);
      gradient.addColorStop(0, "#bfe3ff");
      gradient.addColorStop(1, "#e6f4ff");
      drawRoundRect(artBoxX, artBoxY, artBoxSize, artBoxSize, 18, gradient as unknown as string, "#18243c", 4);

      // Load Pokémon Sprite onto Canvas
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = spriteUrl;

      await new Promise<void>((resolve) => {
        img.onload = () => {
          try {
            // Draw sprite with 16px inset
            ctx.drawImage(img, artBoxX + 16, artBoxY + 16, artBoxSize - 32, artBoxSize - 32);
          } catch {
            // In case of drawing issue
          }
          resolve();
        };
        img.onerror = () => {
          resolve(); // Gracefully proceed even if artwork fails to load
        };
        setTimeout(resolve, 2500); // Guard timeout
      });

      // 6. Pokémon Name & Archetype
      ctx.fillStyle = "#18243c";
      ctx.font = "bold 26px monospace";
      ctx.textAlign = "center";
      ctx.fillText(pokemon.name.toUpperCase(), W / 2, 416);

      ctx.fillStyle = "#8b1e16";
      ctx.font = "italic bold 15px serif";
      ctx.fillText(`“${pokemon.archetype}”`, W / 2, 442);

      // 7. Match Score Pill
      const pillW = 180;
      const pillH = 36;
      drawRoundRect((W - pillW) / 2, 462, pillW, pillH, 10, "#c7edd4", "#2b8252", 2);
      ctx.fillStyle = "#1b5e37";
      ctx.font = "bold 15px monospace";
      ctx.fillText(`⚡ ${matchPercent}% MATCH`, W / 2, 480);

      // 8. "Why this Pokémon" Box
      const whyBoxX = 44;
      const whyBoxY = 514;
      const whyBoxW = W - 88;
      const whyBoxH = 150;
      drawRoundRect(whyBoxX, whyBoxY, whyBoxW, whyBoxH, 16, "#ffffff", "#18243c", 3);

      ctx.fillStyle = "#18243c";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "left";
      ctx.fillText("WHY THIS COMPANION:", whyBoxX + 18, whyBoxY + 28);

      ctx.fillStyle = "#334155";
      ctx.font = "14px sans-serif";
      wrapText(
        whyThisPokemon,
        whyBoxX + 18,
        whyBoxY + 54,
        whyBoxW - 36,
        22,
        4
      );

      // 9. Ash & Misty Perspectives Row
      const trainerBoxW = (whyBoxW - 14) / 2;
      const trainerBoxH = 74;
      const trainerBoxY = 676;

      // Ash Box
      drawRoundRect(whyBoxX, trainerBoxY, trainerBoxW, trainerBoxH, 12, "#e9f2fb", "#18243c", 2);
      ctx.fillStyle = "#1a73e8";
      ctx.font = "bold 10px monospace";
      ctx.fillText("ASH SAYS:", whyBoxX + 12, trainerBoxY + 22);
      ctx.fillStyle = "#1e293b";
      ctx.font = "italic 11px sans-serif";
      wrapText(`"${ashTake}"`, whyBoxX + 12, trainerBoxY + 40, trainerBoxW - 24, 16, 2);

      // Misty Box
      drawRoundRect(whyBoxX + trainerBoxW + 14, trainerBoxY, trainerBoxW, trainerBoxH, 12, "#fcedec", "#18243c", 2);
      ctx.fillStyle = "#e24236";
      ctx.font = "bold 10px monospace";
      ctx.fillText("MISTY SAYS:", whyBoxX + trainerBoxW + 26, trainerBoxY + 22);
      ctx.fillStyle = "#1e293b";
      ctx.font = "italic 11px sans-serif";
      wrapText(`"${mistyTake}"`, whyBoxX + trainerBoxW + 26, trainerBoxY + 40, trainerBoxW - 24, 16, 2);

      // 10. Footer Branding
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText("POKÉLIFE • 151 ORIGINAL KANTO COMPANIONS", W / 2, 778);

      // Convert to Blob and Download
      canvas.toBlob((blob) => {
        if (!blob) {
          showToast("CARD SAVE FAILED");
          setIsGeneratingCard(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pokelife-${pokemon.name.toLowerCase()}-result-card.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast("RESULT CARD SAVED!");
        setIsGeneratingCard(false);
      }, "image/png");
    } catch {
      showToast("CARD SAVE FAILED");
      setIsGeneratingCard(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0c1424]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        ref={modalRef}
        className="rpg-panel bg-[#faf8f2] w-full max-w-lg max-h-[92vh] overflow-y-auto p-5 sm:p-6 relative shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div
            role="status"
            aria-live="polite"
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-[#18243c] text-[#f1c40f] border-2 border-[#f1c40f] px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 font-['Press_Start_2P',monospace] text-[10px] sm:text-xs animate-bounce"
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#18243c]/20 pb-3">
          <div className="flex items-center gap-2">
            <PokeballIcon className="w-5 h-5 shrink-0" />
            <h2
              id="share-modal-title"
              className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-[#18243c]"
            >
              SHARE YOUR RESULT
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collectible Card Preview */}
        <div className="bg-[#f4f1e6] border-2 border-[#18243c] rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[10px] font-['Press_Start_2P',monospace] text-slate-600">
            <span>POKÉLIFE MATCH</span>
            <span className="text-[#8b1e16]">#{String(pokemon.id).padStart(3, "0")}</span>
          </div>

          <div className="grid grid-cols-12 gap-3 items-center">
            {/* Pokémon Artwork */}
            <div className="col-span-4 relative aspect-square bg-gradient-to-b from-[#bfe3ff] to-[#e6f4ff] rounded-xl border-2 border-[#18243c] flex items-center justify-center overflow-hidden shadow-inner">
              <Image
                src={spriteUrl}
                alt={pokemon.name}
                fill
                sizes="120px"
                className="object-contain p-1.5 drop-shadow-md"
                priority
                unoptimized
              />
            </div>

            {/* Pokémon Identification */}
            <div className="col-span-8 space-y-1">
              <h3 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-[#18243c] uppercase">
                {pokemon.name}
              </h3>
              <p className="font-serif italic text-xs font-bold text-[#8b1e16]">
                {pokemon.archetype}
              </p>

              {/* Types */}
              <div className="flex flex-wrap gap-1 pt-1">
                {pokemon.types.map((type) => (
                  <span
                    key={type}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded border border-[#18243c] ${
                      TYPE_COLORS[type] || "bg-slate-500 text-white"
                    }`}
                  >
                    {type}
                  </span>
                ))}
              </div>

              {/* Match Percentage Pill */}
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 bg-[#c7edd4] border-2 border-[#2b8252] text-[#1b5e37] rounded-lg px-2 py-0.5 font-['Press_Start_2P',monospace] text-[9px] font-bold">
                  {matchPercent}% MATCH
                </span>
              </div>
            </div>
          </div>

          {/* Compact Ash & Misty Takes Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#18243c]/15 text-[11px]">
            <div className="bg-[#e9f2fb] border border-[#18243c]/40 rounded-lg p-2">
              <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#1a73e8] block mb-0.5">
                ASH
              </span>
              <p className="text-slate-800 line-clamp-2 italic font-medium">
                &ldquo;{ashTake}&rdquo;
              </p>
            </div>
            <div className="bg-[#fcedec] border border-[#18243c]/40 rounded-lg p-2">
              <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#e24236] block mb-0.5">
                MISTY
              </span>
              <p className="text-slate-800 line-clamp-2 italic font-medium">
                &ldquo;{mistyTake}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: 1. COPY RESULT, 2. SHARE, 3. SAVE RESULT CARD */}
        <div className="space-y-2.5 pt-1">
          {/* Action 1: COPY RESULT */}
          <button
            type="button"
            onClick={handleCopyResult}
            className="w-full rpg-btn-secondary py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#18243c] flex items-center justify-center gap-2 hover:bg-[#e4dec8] transition"
          >
            <Copy className="w-4 h-4 text-[#18243c]" />
            <span>COPY RESULT</span>
          </button>

          {/* Action 2: SHARE (Native Web Share / Copy fallback) */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full rpg-btn-primary py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>SHARE</span>
          </button>

          {/* Action 3: SAVE RESULT CARD */}
          <button
            type="button"
            onClick={handleSaveResultCard}
            disabled={isGeneratingCard}
            className="w-full bg-[#18243c] hover:bg-[#233454] active:bg-[#10192e] text-white border-3 border-[#10192e] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            {isGeneratingCard ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>GENERATING CARD...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-amber-300" />
                <span>SAVE RESULT CARD</span>
              </>
            )}
          </button>
        </div>

        {/* Privacy Note — Mandatory explicit line */}
        <div className="pt-2 border-t border-[#18243c]/15 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Your original situation won&apos;t be shared.</span>
        </div>
      </div>
    </div>
  );
}
