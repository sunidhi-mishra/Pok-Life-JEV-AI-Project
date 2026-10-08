/**
 * Grok Client and Adapter for PokéLife
 *
 * RESPONSIBILITIES:
 * 1. Natural Language Extraction: Translates raw user situation text into
 *    structured situational need weights (1-5 scale) and a clean summary.
 * 2. Natural Language Generation: Generates Ash and Misty's takes and the
 *    final playful retro match explanation for the JEV-selected Pokémon.
 *
 * RULES:
 * - Grok does NOT select Pokémon.
 * - Grok does NOT enforce Generation-1 constraints.
 * - Dimension weights reflect SITUATIONAL NEED, not user personality.
 */

import { MATCHING_DIMENSIONS } from "../matching/dimensions.ts";
import type {
  GrokSituationAnalysisInput,
  GrokSituationAnalysisOutput,
  GrokExplanationInput,
  GrokExplanationOutput,
} from "../../types/ai.ts";
import { AIProviderError } from "../../types/ai.ts";
import {
  validateGrokSituationOutput,
  validateGrokExplanationOutput,
} from "../validation/aiSchemas.ts";

export interface GrokClientConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  timeoutMs?: number;
}

export class GrokClient {
  private readonly apiKey: string | undefined;
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly timeoutMs: number;

  constructor(config: GrokClientConfig = {}) {
    this.apiKey = config.apiKey || process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
    this.baseUrl = config.baseUrl || process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
    this.model = config.model || process.env.GROQ_MODEL || process.env.GROK_MODEL || "openai/gpt-oss-120b";
    this.timeoutMs = config.timeoutMs || 25000;
  }

  /**
   * Part A: Analyze User Situation -> Structured Needs & Summary
   */
  async analyzeSituation(
    input: GrokSituationAnalysisInput
  ): Promise<GrokSituationAnalysisOutput> {
    if (!input?.situationText || input.situationText.trim().length === 0) {
      throw new AIProviderError(
        "grok",
        "MALFORMED_INPUT",
        "Situation text cannot be empty."
      );
    }

    if (!this.apiKey) {
      throw new AIProviderError(
        "grok",
        "MISSING_API_KEY",
        "GROQ_API_KEY is not set in environment."
      );
    }

    const systemPrompt = `You are the Situational Needs Interpreter for PokéLife, a playful reflection tool.
Given the user's real-life dilemma, determine what qualities or companion energies the SITUATION calls for.
These are NOT the user's personality traits; they indicate what kind of supportive energy would help in this specific moment.

Rate each of the following 6 dimensions on an integer scale from 1 (low situational need) to 5 (critical situational need):
- confidence: Need for bold self-assertion, initiative, and stepping into visibility.
- persistence: Need to endure friction, maintain stamina, and grind through difficulty.
- adaptability: Need to pivot, improvise, and navigate chaotic or unfamiliar conditions.
- courage: Need to take risks, face fear directly, and make daunting leaps.
- patience: Need to respect timing, delay gratification, and allow foundations to mature.
- calm: Need for emotional equilibrium, de-escalation, and centering under stress.

Return a JSON object strictly matching this schema:
{
  "situationSummary": "A concise 1-2 sentence non-clinical summary of the situation.",
  "dimensionWeights": {
    "confidence": <1-5 integer>,
    "persistence": <1-5 integer>,
    "adaptability": <1-5 integer>,
    "courage": <1-5 integer>,
    "patience": <1-5 integer>,
    "calm": <1-5 integer>
  }
}
Do NOT diagnose or provide therapy. Do NOT recommend any Pokémon in this step.`;

    const rawResponse = await this.executeChatCompletion([
      { role: "system", content: systemPrompt },
      { role: "user", content: input.situationText },
    ]);

    const parsed = this.parseJson(rawResponse);
    validateGrokSituationOutput(parsed);
    return parsed;
  }

  /**
   * Part B: Generate Final Ash/Misty Takes & Match Explanation
   */
  async generateExplanation(
    input: GrokExplanationInput
  ): Promise<GrokExplanationOutput> {
    if (!input?.selectedPokemon || !input?.candidateCard) {
      throw new AIProviderError(
        "grok",
        "MALFORMED_INPUT",
        "Selected Pokémon and candidate card are required."
      );
    }

    if (!this.apiKey) {
      throw new AIProviderError(
        "grok",
        "MISSING_API_KEY",
        "GROQ_API_KEY is not set in environment."
      );
    }

    const poke = input.selectedPokemon;
    const card = input.candidateCard;

    const systemPrompt = `You are the Dialogue and Reflection Generator for PokéLife.
The decision engine has ALREADY selected the Pokémon partner (#${poke.id} ${poke.name}) based on structured criteria.
You CANNOT change the Pokémon. Your job is to explain the match and give Ash & Misty's perspectives.

Characters:
- Ash: Optimistic, action-oriented, adventurous, high-energy, encouraging. (1-3 sentences max).
- Misty: Practical, grounded, emotionally perceptive, mindful of risks and self-care. (1-3 sentences max).

Explanation:
- whyThisPokemon: 2-4 sentences explaining why this Pokémon's archetype ("${card.archetype}") and strengths (${card.strengths.join(", ")}) fit the user's situation, gently acknowledging its blind spot ("${card.blindSpot}") as something to watch out for.

Tone: Playful, retro, reflective, subjective. Do NOT claim objective accuracy or clinical validity.

Return a JSON object strictly matching this schema:
{
  "ashTake": "...",
  "mistyTake": "...",
  "whyThisPokemon": "..."
}`;

    const userPrompt = `Situation: "${input.situationSummary}"
Selected Pokémon: #${poke.id} ${poke.name} (${poke.canonical.category})
Archetype: ${card.archetype}
Top Matched Dimensions: ${card.matchedDimensions
      .slice(0, 3)
      .map((m) => `${m.dimension} (need: ${m.userNeedWeight}, rating: ${m.pokemonRating})`)
      .join(", ")}`;

    const rawResponse = await this.executeChatCompletion([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    const parsed = this.parseJson(rawResponse);
    validateGrokExplanationOutput(parsed);
    return parsed;
  }

  // --------------------------------------------------------------------------
  // Internal HTTP helper
  // --------------------------------------------------------------------------
  private async executeChatCompletion(
    messages: Array<{ role: string; content: string }>
  ): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
    let res: Response | null = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        res = await fetch(`${this.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages,
            temperature: 0.7,
            response_format: { type: "json_object" },
          }),
          signal: controller.signal,
        });

        if (res.status === 429 || res.status === 529 || res.status === 503) {
          if (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 3000 * attempts));
            continue;
          }
        }
        break;
      } catch (err) {
        if (attempts >= maxAttempts) throw err;
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempts));
      }
    }

    if (!res || !res.ok) {
      const errorText = await res?.text().catch(() => "") || "";
      throw new AIProviderError(
        "grok",
        "API_ERROR",
        `Grok API returned status ${res?.status}: ${errorText}`
      );
    }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content || typeof content !== "string") {
        throw new AIProviderError(
          "grok",
          "INVALID_OUTPUT",
          "Grok response contained no text content."
        );
      }
      return content;
    } catch (err: unknown) {
      if (err instanceof AIProviderError) throw err;
      if ((err as Error)?.name === "AbortError") {
        throw new AIProviderError("grok", "TIMEOUT", "Grok request timed out.");
      }
      throw new AIProviderError(
        "grok",
        "API_ERROR",
        `Grok network request failed: ${(err as Error)?.message}`
      );
    } finally {
      clearTimeout(timer);
    }
  }

  private parseJson(text: string): unknown {
    try {
      return JSON.parse(text);
    } catch {
      throw new AIProviderError(
        "grok",
        "INVALID_OUTPUT",
        `Failed to parse Grok JSON output: ${text.slice(0, 100)}`
      );
    }
  }
}

// ============================================================================
// PART F: Mock Grok Implementation for Offline Development & Tests
// ============================================================================

export function mockGrokSituationAnalysis(
  input: GrokSituationAnalysisInput
): GrokSituationAnalysisOutput {
  if (!input?.situationText || input.situationText.trim().length === 0) {
    throw new AIProviderError(
      "grok",
      "MALFORMED_INPUT",
      "Situation text cannot be empty."
    );
  }

  const text = input.situationText.toLowerCase();

  // Heuristic mock mapping based on semantic keywords
  const weights: Record<(typeof MATCHING_DIMENSIONS)[number], number> = {
    confidence: 3,
    persistence: 3,
    adaptability: 3,
    courage: 3,
    patience: 3,
    calm: 3,
  };

  if (text.includes("friend") || text.includes("relationship") || text.includes("family")) {
    weights.calm = 5;
    weights.patience = 5;
    weights.adaptability = 4;
    weights.courage = 3;
    weights.persistence = 2;
    weights.confidence = 2;
  } else if (text.includes("relocat") || text.includes("country") || text.includes("change")) {
    weights.adaptability = 5;
    weights.courage = 5;
    weights.confidence = 4;
    weights.calm = 3;
    weights.persistence = 3;
    weights.patience = 2;
  } else if (text.includes("promote") || text.includes("lead") || text.includes("manager")) {
    weights.confidence = 5;
    weights.courage = 4;
    weights.calm = 4;
    weights.adaptability = 3;
    weights.persistence = 3;
    weights.patience = 3;
  } else if (text.includes("burnout") || text.includes("exhaust") || text.includes("nervous") || text.includes("panic")) {
    weights.calm = 5;
    weights.patience = 5;
    weights.confidence = 2;
    weights.persistence = 1;
    weights.courage = 2;
    weights.adaptability = 3;
  } else if (text.includes("habit") || text.includes("routine") || text.includes("fitness") || text.includes("consistency")) {
    weights.persistence = 5;
    weights.patience = 5;
    weights.confidence = 3;
    weights.calm = 3;
    weights.adaptability = 2;
    weights.courage = 2;
  } else if (text.includes("writing") || text.includes("creative") || text.includes("imposter") || text.includes("motivation")) {
    weights.confidence = 5;
    weights.courage = 4;
    weights.persistence = 4;
    weights.adaptability = 3;
    weights.calm = 3;
    weights.patience = 2;
  } else if (text.includes("job") || text.includes("career") || text.includes("work")) {
    weights.adaptability = 5;
    weights.courage = 4;
    weights.calm = 4;
    weights.confidence = 4;
    weights.persistence = 3;
    weights.patience = 2;
  } else if (text.includes("exam") || text.includes("study") || text.includes("marathon")) {
    weights.persistence = 5;
    weights.patience = 4;
    weights.calm = 4;
    weights.confidence = 3;
    weights.courage = 2;
    weights.adaptability = 2;
  } else {
    weights.confidence = 4;
    weights.courage = 4;
    weights.persistence = 4;
    weights.adaptability = 3;
    weights.patience = 2;
    weights.calm = 3;
  }

  const summary = `Facing a situational challenge: "${input.situationText.trim().slice(0, 80)}..."`;

  const output: GrokSituationAnalysisOutput = {
    situationSummary: summary,
    dimensionWeights: weights,
  };

  validateGrokSituationOutput(output);
  return output;
}

export function mockGrokExplanation(
  input: GrokExplanationInput
): GrokExplanationOutput {
  if (!input?.selectedPokemon || !input?.candidateCard) {
    throw new AIProviderError(
      "grok",
      "MALFORMED_INPUT",
      "Selected Pokémon and candidate card are required for explanation."
    );
  }

  const poke = input.selectedPokemon;
  const card = input.candidateCard;

  const output: GrokExplanationOutput = {
    ashTake: `All right! With ${poke.name} by your side, you've got the energy to tackle this head-on! Don't look back—give it everything you've got!`,
    mistyTake: `Take a breath first. ${poke.name} has great strengths, but watch out for ${card.blindSpot.toLowerCase()}. Plan your moves carefully!`,
    whyThisPokemon: `As "${card.archetype}", ${poke.name} is a fitting match for your current dilemma. Their strengths in ${card.strengths.join(" and ")} provide the exact balance this moment calls for.`,
  };

  validateGrokExplanationOutput(output);
  return output;
}
