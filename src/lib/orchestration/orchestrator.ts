/**
 * Orchestration Core for PokéLife Matching Pipeline
 *
 * Pipeline sequence:
 * 1. INPUT_VALIDATION: Validate & sanitize situation text
 * 2. GROK_ANALYSIS: Extract structured situation summary & 6 dimension weights
 * 3. CANDIDATE_MATCHING: Deterministically rank 151 Pokémon down to top 5 candidates
 * 4. JEV_SELECTION: Structured judgment selecting the single best candidate from shortlist
 * 5. POKEMON_RESOLUTION: Resolve authoritative data from local pokemon151.json
 * 6. GROK_EXPLANATION: Generate Ash & Misty takes and match rationale
 * 7. RESPONSE_VALIDATION: Assemble and return strongly typed response
 */

import type { PokemonRecord } from "../../types/pokemon.ts";
import type {
  MatchApiRequest,
  MatchApiResponseSuccess,
  MatchApiResponseError,
} from "../../types/api.ts";
import type {
  GrokSituationAnalysisOutput,
  GrokExplanationOutput,
  JevSelectionOutput,
} from "../../types/ai.ts";
import { AIProviderError } from "../../types/ai.ts";
import { validateMatchApiInput, ApiInputValidationError } from "../validation/apiInput.ts";
import { rankCandidates, MatchingValidationError } from "../matching/filter.ts";
import type { CandidateCard } from "../matching/filter.ts";
import {
  GrokClient,
  mockGrokSituationAnalysis,
  mockGrokExplanation,
} from "../ai/grok.ts";
import {
  JevClient,
  mockJevSelection,
} from "../ai/jev.ts";
import {
  validateGrokSituationOutput,
  validateGrokExplanationOutput,
  validateJevSelectionOutput,
} from "../validation/aiSchemas.ts";
import datasetJson from "../../data/pokemon151.json" with { type: "json" };

const pokemonDataset = datasetJson as PokemonRecord[];

export interface OrchestrationOptions {
  mockMode?: boolean;
  grokClient?: GrokClient;
  jevClient?: JevClient;
}

export type PipelineStage =
  | "INPUT_VALIDATION"
  | "GROK_ANALYSIS"
  | "CANDIDATE_MATCHING"
  | "JEV_SELECTION"
  | "POKEMON_RESOLUTION"
  | "GROK_EXPLANATION"
  | "RESPONSE_VALIDATION";

export interface OrchestrationResult {
  status: number;
  data: MatchApiResponseSuccess | MatchApiResponseError;
  stageReached: PipelineStage;
}

export async function executeMatchPipeline(
  rawInput: unknown,
  options: OrchestrationOptions = {}
): Promise<OrchestrationResult> {
  const hasLlmKey = Boolean(process.env.GROQ_API_KEY || process.env.GROK_API_KEY);
  const hasJevKey = Boolean(process.env.OPENROUTER_API_KEY);
  const isMockMode =
    options.mockMode ??
    (process.env.AI_MOCK_MODE === "true" || !hasLlmKey || !hasJevKey);

  let currentStage: PipelineStage = "INPUT_VALIDATION";

  try {
    // ------------------------------------------------------------------------
    // STAGE 1: INPUT_VALIDATION
    // ------------------------------------------------------------------------
    currentStage = "INPUT_VALIDATION";
    const validatedInput: MatchApiRequest = validateMatchApiInput(rawInput);

    // ------------------------------------------------------------------------
    // STAGE 2: GROK_ANALYSIS
    // ------------------------------------------------------------------------
    currentStage = "GROK_ANALYSIS";
    let situationAnalysis: GrokSituationAnalysisOutput;

    if (isMockMode) {
      situationAnalysis = mockGrokSituationAnalysis({
        situationText: validatedInput.situation,
      });
    } else {
      const grok = options.grokClient || new GrokClient();
      situationAnalysis = await grok.analyzeSituation({
        situationText: validatedInput.situation,
      });
    }

    // Validate structured Grok output
    validateGrokSituationOutput(situationAnalysis);

    // ------------------------------------------------------------------------
    // STAGE 3: CANDIDATE_MATCHING (Deterministic)
    // ------------------------------------------------------------------------
    currentStage = "CANDIDATE_MATCHING";
    const topCandidates: CandidateCard[] = rankCandidates(
      { dimensionWeights: situationAnalysis.dimensionWeights },
      pokemonDataset,
      5 // Top 5 candidates
    );

    if (!topCandidates || topCandidates.length === 0) {
      throw new MatchingValidationError("Deterministic matcher returned no candidates.");
    }

    const candidateShortlistIds = topCandidates.map((c) => c.id);

    // ------------------------------------------------------------------------
    // STAGE 4: JEV_SELECTION (Structured Judgment)
    // ------------------------------------------------------------------------
    currentStage = "JEV_SELECTION";
    const jevCandidatesPayload = topCandidates.map((c) => ({
      id: c.id,
      name: c.name,
      archetype: c.archetype,
      strengths: c.strengths,
      blindSpot: c.blindSpot,
      dimensionRatings: c.dimensionRatings,
      deterministicScore: c.deterministicScore,
    }));

    let jevResult: JevSelectionOutput;

    if (isMockMode) {
      jevResult = mockJevSelection({
        situationSummary: situationAnalysis.situationSummary,
        dimensionWeights: situationAnalysis.dimensionWeights,
        candidates: jevCandidatesPayload,
      });
    } else {
      const jev = options.jevClient || new JevClient();
      jevResult = await jev.selectBestCandidate({
        situationSummary: situationAnalysis.situationSummary,
        dimensionWeights: situationAnalysis.dimensionWeights,
        candidates: jevCandidatesPayload,
      });
    }

    // CRITICAL: Validate that JEV selected an ID from the candidate shortlist
    validateJevSelectionOutput(jevResult, candidateShortlistIds);

    // ------------------------------------------------------------------------
    // STAGE 5: POKEMON_RESOLUTION (Local Dataset Authoritative Source)
    // ------------------------------------------------------------------------
    currentStage = "POKEMON_RESOLUTION";
    const selectedPokemonId = jevResult.selectedPokemonId;
    const authoritativePokemon = pokemonDataset.find((p) => p.id === selectedPokemonId);

    if (!authoritativePokemon) {
      return {
        status: 500,
        stageReached: currentStage,
        data: {
          success: false,
          error: {
            code: "POKEMON_NOT_FOUND",
            message: `Selected Pokémon #${selectedPokemonId} could not be resolved in local dataset.`,
          },
        },
      };
    }

    const matchedCard = topCandidates.find((c) => c.id === selectedPokemonId)!;

    // ------------------------------------------------------------------------
    // STAGE 6: GROK_EXPLANATION (Dialogue & Match Narrative)
    // ------------------------------------------------------------------------
    currentStage = "GROK_EXPLANATION";
    let explanationOutput: GrokExplanationOutput;

    if (isMockMode) {
      explanationOutput = mockGrokExplanation({
        situationSummary: situationAnalysis.situationSummary,
        selectedPokemon: authoritativePokemon,
        candidateCard: matchedCard,
      });
    } else {
      const grok = options.grokClient || new GrokClient();
      explanationOutput = await grok.generateExplanation({
        situationSummary: situationAnalysis.situationSummary,
        selectedPokemon: authoritativePokemon,
        candidateCard: matchedCard,
      });
    }

    // Validate structured explanation output
    validateGrokExplanationOutput(explanationOutput);

    // ------------------------------------------------------------------------
    // STAGE 7: RESPONSE_VALIDATION & ASSEMBLY
    // ------------------------------------------------------------------------
    currentStage = "RESPONSE_VALIDATION";
    const responsePayload: MatchApiResponseSuccess = {
      success: true,
      result: {
        pokemon: {
          id: authoritativePokemon.id,
          name: authoritativePokemon.name,
          types: authoritativePokemon.canonical.types,
          category: authoritativePokemon.canonical.category,
          archetype: authoritativePokemon.productInterpretation.archetype,
          strengths: authoritativePokemon.productInterpretation.strengths,
          blindSpot: authoritativePokemon.productInterpretation.blindSpot,
        },
        match: {
          deterministicScore: matchedCard.deterministicScore,
          matchedDimensions: matchedCard.matchedDimensions,
          confidence: jevResult.confidence,
        },
        ashTake: explanationOutput.ashTake,
        mistyTake: explanationOutput.mistyTake,
        whyThisPokemon: explanationOutput.whyThisPokemon,
      },
    };

    return {
      status: 200,
      stageReached: currentStage,
      data: responsePayload,
    };
  } catch (err: unknown) {
    return handlePipelineError(err, currentStage);
  }
}

/**
 * Maps pipeline stage and domain errors to consistent HTTP error responses
 */
function handlePipelineError(err: unknown, stage: PipelineStage): OrchestrationResult {
  // 1. Input validation error -> 400
  if (err instanceof ApiInputValidationError) {
    return {
      status: 400,
      stageReached: stage,
      data: {
        success: false,
        error: {
          code: (err.code as any) || "INVALID_INPUT",
          message: err.message,
        },
      },
    };
  }

  // 2. Upstream AI provider errors
  if (err instanceof AIProviderError) {
    if (err.code === "OUT_OF_BOUNDS_SELECTION") {
      return {
        status: 422,
        stageReached: stage,
        data: {
          success: false,
          error: {
            code: "JUDGMENT_FAILED",
            message: "Judgment model selected a candidate outside the valid shortlist.",
          },
        },
      };
    }

    if (err.code === "MISSING_API_KEY") {
      return {
        status: 503,
        stageReached: stage,
        data: {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "AI service is not configured on the server.",
          },
        },
      };
    }

    if (err.code === "TIMEOUT") {
      return {
        status: 504,
        stageReached: stage,
        data: {
          success: false,
          error: {
            code: stage === "GROK_ANALYSIS" ? "AI_ANALYSIS_FAILED" : "EXPLANATION_FAILED",
            message: "AI service request timed out. Please try again.",
          },
        },
      };
    }

    // Generic provider or output validation error
    const errorCode =
      stage === "GROK_ANALYSIS"
        ? "AI_ANALYSIS_FAILED"
        : stage === "JEV_SELECTION"
        ? "JUDGMENT_FAILED"
        : "EXPLANATION_FAILED";

    return {
      status: 502,
      stageReached: stage,
      data: {
        success: false,
        error: {
          code: errorCode,
          message: "Unable to process reflection with AI provider at this time.",
        },
      },
    };
  }

  // 3. Deterministic matching error -> 500
  if (err instanceof MatchingValidationError) {
    return {
      status: 500,
      stageReached: stage,
      data: {
        success: false,
        error: {
          code: "MATCHING_FAILED",
          message: "Candidate matching failed to evaluate profiles.",
        },
      },
    };
  }

  // 4. Fallthrough unexpected internal error -> 500
  return {
    status: 500,
    stageReached: stage,
    data: {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred while finding your Pokémon partner.",
      },
    },
  };
}
