/**
 * Schema Validation for AI Inputs & Outputs
 *
 * Implements strict, zero-dependency validation matching the project's
 * established pattern in validateSituationProfile.
 */

import { MATCHING_DIMENSIONS } from "../matching/dimensions.ts";
import type { MatchingDimension } from "../matching/dimensions.ts";
import type {
  GrokSituationAnalysisOutput,
  GrokExplanationOutput,
  JevSelectionInput,
  JevSelectionOutput,
} from "../../types/ai.ts";
import { AIProviderError } from "../../types/ai.ts";

// ============================================================================
// Grok Situation Analysis Validator
// ============================================================================

export function validateGrokSituationOutput(
  raw: unknown
): asserts raw is GrokSituationAnalysisOutput {
  if (!raw || typeof raw !== "object") {
    throw new AIProviderError(
      "grok",
      "INVALID_OUTPUT",
      "Grok situation response must be a non-null object."
    );
  }

  const obj = raw as Record<string, unknown>;

  if (
    typeof obj.situationSummary !== "string" ||
    obj.situationSummary.trim().length === 0
  ) {
    throw new AIProviderError(
      "grok",
      "INVALID_OUTPUT",
      "Grok situation output must include a non-empty 'situationSummary' string."
    );
  }

  if (!obj.dimensionWeights || typeof obj.dimensionWeights !== "object") {
    throw new AIProviderError(
      "grok",
      "INVALID_OUTPUT",
      "Grok situation output must include a 'dimensionWeights' object."
    );
  }

  const weights = obj.dimensionWeights as Record<string, unknown>;
  const keys = Object.keys(weights);

  if (keys.length !== MATCHING_DIMENSIONS.length) {
    throw new AIProviderError(
      "grok",
      "INVALID_OUTPUT",
      `Expected ${MATCHING_DIMENSIONS.length} dimension weights, got ${keys.length}.`
    );
  }

  for (const dim of MATCHING_DIMENSIONS) {
    const val = weights[dim];
    if (typeof val !== "number" || !Number.isInteger(val)) {
      throw new AIProviderError(
        "grok",
        "INVALID_OUTPUT",
        `Dimension weight '${dim}' must be an integer. Got: ${String(val)}.`
      );
    }
    if (val < 1 || val > 5) {
      throw new AIProviderError(
        "grok",
        "INVALID_OUTPUT",
        `Dimension weight '${dim}' must be an integer between 1 and 5. Got: ${val}.`
      );
    }
  }
}

// ============================================================================
// Grok Final Explanation Validator
// ============================================================================

export function validateGrokExplanationOutput(
  raw: unknown
): asserts raw is GrokExplanationOutput {
  if (!raw || typeof raw !== "object") {
    throw new AIProviderError(
      "grok",
      "INVALID_OUTPUT",
      "Grok explanation response must be a non-null object."
    );
  }

  const obj = raw as Record<string, unknown>;

  if (typeof obj.ashTake !== "string" || obj.ashTake.trim().length === 0) {
    throw new AIProviderError(
      "grok",
      "INVALID_OUTPUT",
      "Missing or empty 'ashTake' in Grok explanation output."
    );
  }

  if (typeof obj.mistyTake !== "string" || obj.mistyTake.trim().length === 0) {
    throw new AIProviderError(
      "grok",
      "INVALID_OUTPUT",
      "Missing or empty 'mistyTake' in Grok explanation output."
    );
  }

  if (
    typeof obj.whyThisPokemon !== "string" ||
    obj.whyThisPokemon.trim().length === 0
  ) {
    throw new AIProviderError(
      "grok",
      "INVALID_OUTPUT",
      "Missing or empty 'whyThisPokemon' in Grok explanation output."
    );
  }
}

// ============================================================================
// JEV Candidate Input & Selection Output Validators
// ============================================================================

export function validateJevInput(
  raw: unknown
): asserts raw is JevSelectionInput {
  if (!raw || typeof raw !== "object") {
    throw new AIProviderError(
      "jev",
      "MALFORMED_INPUT",
      "JEV input must be a non-null object."
    );
  }

  const obj = raw as Record<string, unknown>;

  if (
    typeof obj.situationSummary !== "string" ||
    obj.situationSummary.trim().length === 0
  ) {
    throw new AIProviderError(
      "jev",
      "MALFORMED_INPUT",
      "JEV input must include a non-empty 'situationSummary'."
    );
  }

  if (!obj.dimensionWeights || typeof obj.dimensionWeights !== "object") {
    throw new AIProviderError(
      "jev",
      "MALFORMED_INPUT",
      "JEV input must include 'dimensionWeights'."
    );
  }

  if (!Array.isArray(obj.candidates) || obj.candidates.length < 1) {
    throw new AIProviderError(
      "jev",
      "MALFORMED_INPUT",
      "JEV input candidates must be a non-empty array."
    );
  }

  const seenIds = new Set<number>();
  for (const c of obj.candidates) {
    if (!c || typeof c.id !== "number" || !Number.isInteger(c.id)) {
      throw new AIProviderError(
        "jev",
        "MALFORMED_INPUT",
        `Candidate must have an integer ID. Got: ${JSON.stringify(c?.id)}`
      );
    }
    if (c.id < 1 || c.id > 151) {
      throw new AIProviderError(
        "jev",
        "MALFORMED_INPUT",
        `Candidate ID must be within 1-151. Got: ${c.id}`
      );
    }
    if (seenIds.has(c.id)) {
      throw new AIProviderError(
        "jev",
        "MALFORMED_INPUT",
        `Duplicate candidate ID in shortlist: ${c.id}`
      );
    }
    seenIds.add(c.id);
  }
}

export function validateJevSelectionOutput(
  raw: unknown,
  allowedCandidateIds: number[]
): asserts raw is JevSelectionOutput {
  if (!raw || typeof raw !== "object") {
    throw new AIProviderError(
      "jev",
      "INVALID_OUTPUT",
      "JEV response must be a non-null object."
    );
  }

  const obj = raw as Record<string, unknown>;

  if (
    typeof obj.selectedPokemonId !== "number" ||
    !Number.isInteger(obj.selectedPokemonId)
  ) {
    throw new AIProviderError(
      "jev",
      "INVALID_OUTPUT",
      `JEV selectedPokemonId must be an integer. Got: ${String(obj.selectedPokemonId)}`
    );
  }

  // CRITICAL CONSTRAINT: JEV may ONLY choose from the supplied candidate shortlist
  if (!allowedCandidateIds.includes(obj.selectedPokemonId)) {
    throw new AIProviderError(
      "jev",
      "OUT_OF_BOUNDS_SELECTION",
      `JEV selected Pokémon ID ${obj.selectedPokemonId}, which is not in the candidate shortlist: [${allowedCandidateIds.join(", ")}].`
    );
  }

  // Validate optional confidence
  if (obj.confidence !== undefined) {
    if (
      typeof obj.confidence !== "number" ||
      isNaN(obj.confidence) ||
      obj.confidence < 0 ||
      obj.confidence > 1
    ) {
      throw new AIProviderError(
        "jev",
        "INVALID_OUTPUT",
        `JEV confidence must be a number between 0.0 and 1.0. Got: ${String(obj.confidence)}`
      );
    }
  }
}
