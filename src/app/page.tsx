"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { InputPanel } from "@/components/InputPanel";
import { ResultPanel } from "@/components/ResultPanel";
import type { MatchApiResponse, MatchApiResponseSuccess } from "@/types/api";

export default function HomePage() {
  const [situation, setSituation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchApiResponseSuccess["result"] | null>(null);

  const handleSubmit = async () => {
    if (!situation.trim() || situation.trim().length < 10) {
      setError("Please describe your situation in at least 10 characters.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: situation.trim() }),
      });

      const data: MatchApiResponse = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.success === false
            ? data.error.message
            : "Something went wrong while finding your companion. Please try again."
        );
      } else {
        setResult(data.result);
      }
    } catch {
      setError("Network error occurred. Please verify your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSituation("");
    setResult(null);
    setError(null);
  };

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
        {/* Soft subtle tint overlay for optimal card contrast */}
        <div className="absolute inset-0 bg-[#0f192c]/20 backdrop-blur-[0.5px]" />
      </div>

      {/* Header Bar */}
      <Header />

      {/* Main Container: Two-Panel RPG Layout */}
      <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Panel: Input Experience */}
          <div className="w-full h-full">
            <InputPanel
              situation={situation}
              setSituation={(val) => {
                setSituation(val);
                if (error) setError(null);
              }}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </div>

          {/* Right Panel: Match Result */}
          <div className="w-full h-full">
            <ResultPanel
              data={result}
              onReset={handleReset}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Subtle Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-3 text-center text-[11px] font-semibold text-slate-200 drop-shadow-sm select-none">
        PokéLife &bull; A playful AI reflection &amp; companion matching experience &bull; Original 151 Kanto Pokémon
      </footer>
    </main>
  );
}
