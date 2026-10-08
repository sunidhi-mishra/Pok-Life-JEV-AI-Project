/**
 * Input validation for /api/match request
 *
 * Enforces:
 * - situation is required, must be string
 * - trimmed length between 10 and 1000 characters
 * - rejects empty or whitespace-only
 * - rejects unexpected control keys (e.g. model, systemPrompt, candidates, etc.)
 */

import type { MatchApiRequest } from "../../types/api.ts";
import { checkInputQuality } from "./qualityGate.ts";

export class ApiInputValidationError extends Error {
  public code: string;

  constructor(message: string, code = "INVALID_INPUT") {
    super(message);
    this.name = "ApiInputValidationError";
    this.code = code;
  }
}

const DISALLOWED_CONTROL_KEYS = [
  "pokemonId",
  "selectedPokemonId",
  "dimensionWeights",
  "systemPrompt",
  "provider",
  "model",
  "candidates",
  "prompt",
];

export function validateMatchApiInput(raw: unknown): MatchApiRequest {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new ApiInputValidationError("Request body must be a valid JSON object.");
  }

  const obj = raw as Record<string, unknown>;

  // Check for disallowed control fields attempting to manipulate pipeline
  for (const key of DISALLOWED_CONTROL_KEYS) {
    if (key in obj) {
      throw new ApiInputValidationError(
        `Control field '${key}' is prohibited. The server owns the matching pipeline.`
      );
    }
  }

  if (!("situation" in obj)) {
    throw new ApiInputValidationError("Missing required field 'situation'.");
  }

  if (typeof obj.situation !== "string") {
    throw new ApiInputValidationError("Field 'situation' must be a string.");
  }

  const trimmed = obj.situation.trim();

  if (trimmed.length === 0) {
    throw new ApiInputValidationError("Please describe your situation. Input cannot be empty.");
  }

  if (trimmed.length < 3) {
    throw new ApiInputValidationError(
      "Please describe your situation in a bit more detail (at least 3 characters)."
    );
  }

  if (trimmed.length > 1000) {
    throw new ApiInputValidationError(
      "Situation description is too long (maximum 1000 characters)."
    );
  }

  // Deterministic local quality gate check before ANY external calls
  const quality = checkInputQuality(trimmed);
  if (!quality.isValid) {
    throw new ApiInputValidationError(
      quality.userMessage || "That doesn't look like a situation yet. Tell me what's actually going on, even if it's messy.",
      "INPUT_NOT_MEANINGFUL"
    );
  }

  return { situation: trimmed };
}
