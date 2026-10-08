/**
 * JEV Structured Judgment Client via OpenRouter Decisions API
 *
 * SPECIFICATION:
 * - Provider: OpenRouter
 * - Model: typesafe/jev-1.13
 * - Endpoint: POST https://openrouter.ai/api/alpha/decisions
 * - Primitive: 'choice' question type
 * - Authentication: Bearer $OPENROUTER_API_KEY
 * - Output: Structured typed choice, probability distribution, and confidence.
 * - Non-generative: Zero prose generation.
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
 * - JEV must NOT generate explanations or free-form text.
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
    // Uses OPENROUTER_API_KEY as the authoritative key
    this.apiKey = config.apiKey || process.env.OPENROUTER_API_KEY;
    this.baseUrl = config.baseUrl || "https://openrouter.ai/api/alpha";
    this.model = config.model || process.env.JEV_MODEL || "typesafe/jev-1.13";
    this.timeoutMs = config.timeoutMs || 12000;
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
        "OPENROUTER_API_KEY is not set in environment."
      );
    }

    const allowedIds = input.candidates.map((c) => c.id);

    // Build the candidate criteria map for JEV's Choice primitive
    const criteria: Record<string, string> = {};
    for (const c of input.candidates) {
      criteria[`candidate_${c.id}`] =
        `#${c.id} ${c.name}: Archetype "${c.archetype}". Key strengths: ${c.strengths.join(", ")}. Blind spot: ${c.blindSpot}. Ranked with deterministic suitability score ${c.deterministicScore}.`;
    }

    // Build the structured state for Jev to evaluate
    const state = {
      situation: {
        summary: input.situationSummary,
        dimensionWeights: input.dimensionWeights,
      },
      evaluationGoal:
        "Select the single best companion archetype from the candidate list that best supports the user through their core trade-offs, blind spots, and situational needs.",
    };

    const requestBody = {
      model: this.model,
      state,
      questions: {
        pokemon_match: {
          type: "choice",
          instructions:
            "Which candidate Pokémon is the strongest companion for this situation considering strengths and blind spot trade-offs?",
          criteria,
        },
      },
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
    let res: Response | null = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        res = await fetch(`${this.baseUrl}/decisions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
            "HTTP-Referer": "https://pokelife.local",
            "X-Title": "PokéLife Companion Matcher",
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        if (res.status === 529 || res.status === 429) {
          if (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 2000 * attempts));
            continue;
          }
        }
        break;
      } catch (err) {
        if (attempts >= maxAttempts) throw err;
        await new Promise((resolve) => setTimeout(resolve, 1500 * attempts));
      }
    }

    if (!res || !res.ok) {
      const errorText = await res?.text().catch(() => "") || "";
      throw new AIProviderError(
        "jev",
        "API_ERROR",
        `OpenRouter JEV API returned status ${res?.status}: ${errorText}`
      );
    }

      const responseJson = await res.json();

      // OpenRouter Decisions API returns answers under answers.choices.<question_name> or answers.<question_name>
      const answer =
        responseJson.answers?.choices?.pokemon_match ||
        responseJson.answers?.pokemon_match;

      if (!answer || typeof answer.choice !== "string") {
        throw new AIProviderError(
          "jev",
          "INVALID_OUTPUT",
          "Malformed response from OpenRouter Decisions API: missing or invalid choice answer."
        );
      }

      // Parse candidate key (e.g. "candidate_25" -> 25)
      const selectedIdStr = answer.choice.replace("candidate_", "");
      const selectedPokemonId = parseInt(selectedIdStr, 10);

      const usage = responseJson.usage
        ? {
            inputTokens: responseJson.usage.prompt_tokens ?? responseJson.usage.input_tokens,
            outputTokens: responseJson.usage.completion_tokens ?? responseJson.usage.output_tokens ?? 0,
          }
        : undefined;

      const output: JevSelectionOutput = {
        selectedPokemonId,
        confidence: typeof answer.confidence === "number" ? answer.confidence : undefined,
        probabilities: answer.probabilities,
        usage,
      };

      // Strict validation ensuring ID is one of allowed candidates in shortlist
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
        `OpenRouter JEV request failed: ${(err as Error)?.message}`
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

  let bestCandidate = input.candidates[0];
  let highestEvaluatedScore = -Infinity;

  const situationLower = input.situationSummary.toLowerCase();

  for (const c of input.candidates) {
    let judgmentScore = c.deterministicScore;

    const blindLower = c.blindSpot.toLowerCase();
    const strengthsLower = c.strengths.map((s) => s.toLowerCase()).join(" ");

    // Trade-off 1: In situations of burnout or exhaustion, penalize blind spots that push past limits
    if ((situationLower.includes("burnout") || situationLower.includes("exhaust")) && (blindLower.includes("push") || blindLower.includes("rigid"))) {
      judgmentScore -= 8;
    }
    // Trade-off 2: In relationship tensions, penalize posturing or emotional avoidance
    if ((situationLower.includes("friend") || situationLower.includes("relationship")) && (blindLower.includes("postur") || blindLower.includes("command"))) {
      judgmentScore -= 7;
    }
    // Trade-off 3: In creative block / motivation dips, boost playful or autonomous catalysts
    if (situationLower.includes("writing") || situationLower.includes("creative")) {
      if (strengthsLower.includes("creative") || strengthsLower.includes("spontan") || strengthsLower.includes("levity")) {
        judgmentScore += 5;
      }
      if (blindLower.includes("suffocate") || blindLower.includes("command")) {
        judgmentScore -= 8;
      }
    }
    // Trade-off 4: In high-stakes career crossroads / conflicting offers, reward autonomy & rapid adaptation over rigid control
    if (situationLower.includes("offer") || situationLower.includes("conflict")) {
      if (blindLower.includes("suffocate") || blindLower.includes("command")) {
        judgmentScore -= 5;
      }
      if (c.dimensionRatings.adaptability >= 4 || strengthsLower.includes("speed")) {
        judgmentScore += 4;
      }
    }
    // Trade-off 5: In relocation / major change, reward candidates with calm anchoring or resilience
    if (situationLower.includes("relocat") || situationLower.includes("country")) {
      if (c.dimensionRatings.adaptability >= 4) {
        judgmentScore += 4;
      }
      if (blindLower.includes("prank") || blindLower.includes("mischief")) {
        judgmentScore -= 6;
      }
    }
    // Trade-off 6: Overthinking paralysis benefits from instincts and spontaneous action
    if (situationLower.includes("overthink") && (strengthsLower.includes("instinct") || strengthsLower.includes("spontan"))) {
      judgmentScore += 6;
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
    usage: {
      inputTokens: 180,
      outputTokens: 0,
    },
  };

  validateJevSelectionOutput(output, allowedIds);
  return output;
}
