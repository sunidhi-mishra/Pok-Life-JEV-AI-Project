/**
 * Core Domain & AI Contract Types for PokéLife
 */

import type { MatchingDimension } from "../lib/matching/dimensions.ts";
import type { CandidateCard } from "../lib/matching/filter.ts";
import type { PokemonRecord } from "./pokemon.ts";

// ============================================================================
// PART A: Grok Situation Analysis Contract
// ============================================================================

export interface GrokSituationAnalysisInput {
  situationText: string;
}

export interface GrokSituationAnalysisOutput {
  situationSummary: string; // 1-2 sentence non-clinical summary
  dimensionWeights: Record<MatchingDimension, number>; // Strictly 1-5 integers
}

// ============================================================================
// PART B: Grok Final Explanation Contract
// ============================================================================

export interface GrokExplanationInput {
  situationSummary: string;
  selectedPokemon: PokemonRecord;
  candidateCard: CandidateCard;
  decisionFactors?: string[];
}

export interface GrokExplanationOutput {
  ashTake: string;       // 1-3 sentences: bold, optimistic, forward-momentum
  mistyTake: string;     // 1-3 sentences: grounded, practical, risk-aware
  whyThisPokemon: string;// 2-4 sentences: subjective rationale connecting traits
}

// ============================================================================
// PART C: JEV Structured Selection Contract
// ============================================================================

export interface JevCandidateItem {
  id: number;
  name: string;
  archetype: string;
  strengths: string[];
  blindSpot: string;
  dimensionRatings: Record<MatchingDimension, number>;
  deterministicScore: number;
}

export interface JevSelectionInput {
  situationSummary: string;
  dimensionWeights: Record<MatchingDimension, number>;
  candidates: JevCandidateItem[];
}

export interface JevSelectionOutput {
  selectedPokemonId: number; // Strictly one of candidate IDs
  confidence?: number;       // Calibrated probability (0.0 to 1.0) if returned
  probabilities?: Record<string, number>; // Distribution over candidate choices
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

// ============================================================================
// Error Types
// ============================================================================

export class AIProviderError extends Error {
  readonly provider: "grok" | "jev";
  readonly code:
    | "MISSING_API_KEY"
    | "TIMEOUT"
    | "API_ERROR"
    | "INVALID_OUTPUT"
    | "OUT_OF_BOUNDS_SELECTION"
    | "MALFORMED_INPUT";

  constructor(
    provider: "grok" | "jev",
    code: AIProviderError["code"],
    message: string
  ) {
    super(`[${provider.toUpperCase()}_ERROR:${code}] ${message}`);
    this.name = "AIProviderError";
    this.provider = provider;
    this.code = code;
  }
}
