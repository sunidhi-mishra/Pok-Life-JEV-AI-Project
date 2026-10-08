/**
 * JEV Structured Judgment Client and Adapter for PokéLife
 *
 * OFFICIAL API SPECIFICATION:
 * - Provider: TypeSafe AI (System One model)
 * - Endpoint: POST https://api.typesafe.ai/v1/systemone
 * - Primitive: 'choice' question type
 * - Returns: Typed structured choice, probabilities, and calibrated confidence.
 * - Non-generative: Produces zero free-form prose.
 *
 * ARCHITECTURAL ROLE:
 * JEV resolves semantic trade-offs across the top 3-5 candidates filtered by
 * deterministic code. JEV evaluates:
 * "Given this specific situation, which of these candidates is the most fitting
 * companion, considering the trade-offs between their strengths and blind spots?"
 *
 * RULES:
 * - JEV must NOT rubber-stamp the highest deterministic score.
 * - JEV must NOT invent Pokémon IDs outside the provided shortlist.
 * - JEV must NOT generate explanations or text.
 */

import type {
  JevSelectionInput,
  JevSelectionOutput,
} from "../../types/ai.ts";
import { AIProviderError } from "../../types/ai.ts";
import {
  validateJevInput,
  validateJevSelectionOutput,
} from "../validation/aiSchemas.ts";

export interface JevClientConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  timeoutMs?: number;
}

export class JevClient {
  private readonly apiKey: string | undefined;
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly timeoutMs: number;

  constructor(config: JevClientConfig = {}) {
    this.apiKey = config.apiKey || process.env.JEV_API_KEY;
    this.baseUrl = config.baseUrl || "https://api.typesafe.ai/v1";
    this.model = config.model || "jev-latest";
    this.timeoutMs = config.timeoutMs || 10000;
  }

  /**
   * Part C: Execute Constrained Structured Judgment over Candidate Shortlist
   */
  async selectBestCandidate(input: JevSelectionInput): Promise<JevSelectionOutput> {
    validateJevInput(input);

    if (!this.apiKey) {
      throw new AIProviderError(
        "jev",
        "MISSING_API_KEY",
        "JEV_API_KEY is not set in environment."
      );
    }

    const allowedIds = input.candidates.map((c) => c.id);

    // Build the candidate criteria map for JEV's Choice primitive
    const criteria: Record<string, string> = {};
    for (const c of input.candidates) {
      criteria[`candidate_${c.id}`] =
        `#${c.id} ${c.name} | Archetype: ${c.archetype} | Strengths: [${c.strengths.join(", ")}] | Blind Spot: ${c.blindSpot} | Deterministic Score: ${c.deterministicScore}`;
    }

    // Build the state representation for JEV to analyze
    const state = `User Situation: "${input.situationSummary}"
Situational Needs:
- Confidence Need: ${input.dimensionWeights.confidence}/5
- Persistence Need: ${input.dimensionWeights.persistence}/5
- Adaptability Need: ${input.dimensionWeights.adaptability}/5
- Courage Need: ${input.dimensionWeights.courage}/5
- Patience Need: ${input.dimensionWeights.patience}/5
- Calm Need: ${input.dimensionWeights.calm}/5

Evaluation Goal:
Select the single best companion archetype from the candidate list that best supports the user through their core trade-off.`;

    const requestBody = {
      model: this.model,
      state,
      questions: {
        pokemon_match: {
          type: "choice",
          instructions:
            "Select the best companion option for this situation considering strengths and blind spot trade-offs.",
          criteria,
        },
      },
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(`${this.baseUrl}/systemone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new AIProviderError(
          "jev",
          "API_ERROR",
          `JEV API returned status ${res.status}: ${errorText}`
        );
      }

      const responseJson = await res.json();
      const answer = responseJson.answers?.pokemon_match;

      if (!answer || answer.type !== "choice" || typeof answer.choice !== "string") {
        throw new AIProviderError(
          "jev",
          "INVALID_OUTPUT",
          "Malformed response from JEV: missing or invalid choice answer."
        );
      }

      // Parse candidate key (e.g. "candidate_25" -> 25)
      const selectedIdStr = answer.choice.replace("candidate_", "");
      const selectedPokemonId = parseInt(selectedIdStr, 10);

      const output: JevSelectionOutput = {
        selectedPokemonId,
        confidence: typeof answer.confidence === "number" ? answer.confidence : undefined,
        probabilities: answer.probabilities,
      };

      // Strict validation ensuring ID is one of allowed candidates
      validateJevSelectionOutput(output, allowedIds);
      return output;
    } catch (err: unknown) {
      if (err instanceof AIProviderError) throw err;
      if ((err as Error)?.name === "AbortError") {
        throw new AIProviderError("jev", "TIMEOUT", "JEV request timed out.");
      }
      throw new AIProviderError(
        "jev",
        "API_ERROR",
        `JEV network request failed: ${(err as Error)?.message}`
      );
    } finally {
      clearTimeout(timer);
    }
  }
}

// ============================================================================
// PART F: Mock JEV Implementation for Offline Development & Tests
// ============================================================================

/**
 * Mock JEV Structured Judgment
 *
 * NOTE: Does NOT simply pick candidates[0] (highest deterministic score).
 * Evaluates semantic blind-spot vs strength trade-offs to demonstrate genuine
 * second-stage judgment.
 */
export function mockJevSelection(input: JevSelectionInput): JevSelectionOutput {
  validateJevInput(input);

  const allowedIds = input.candidates.map((c) => c.id);

  // Semantic evaluation rule for Mock:
  // 1. Analyze the core tension in situation summary
  // 2. If the user mentions words like "fear", "anxious", "scared", prefer a candidate
  //    whose strengths include grounding/calm or courage without excessive blind spots
  // 3. Otherwise, select the candidate with the highest holistic suitability score
  let bestCandidate = input.candidates[0];
  let highestEvaluatedScore = -Infinity;

  const situationLower = input.situationSummary.toLowerCase();

  for (const c of input.candidates) {
    let judgmentScore = c.deterministicScore;

    // Semantic adjustment: reward candidates whose blind spots do NOT exacerbate the situation
    if (situationLower.includes("overwhelm") && c.blindSpot.toLowerCase().includes("inertia")) {
      judgmentScore -= 10; // e.g. Snorlax might worsen active overwhelm
    }
    if (situationLower.includes("fear") && c.strengths.some((s) => s.toLowerCase().includes("courage") || s.toLowerCase().includes("bravery"))) {
      judgmentScore += 8; // Boost courageous anchor
    }
    if (situationLower.includes("change") && c.dimensionRatings.adaptability >= 4) {
      judgmentScore += 6; // Boost adaptable catalyst
    }

    if (judgmentScore > highestEvaluatedScore) {
      highestEvaluatedScore = judgmentScore;
      bestCandidate = c;
    }
  }

  const output: JevSelectionOutput = {
    selectedPokemonId: bestCandidate.id,
    confidence: 0.88,
    probabilities: {
      [`candidate_${bestCandidate.id}`]: 0.88,
    },
  };

  validateJevSelectionOutput(output, allowedIds);
  return output;
}
