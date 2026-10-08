/**
 * Deterministic Candidate Filtering and Scoring Module for PokéLife
 *
 * CONCEPT & ROLE:
 * This module takes a structured user situational need profile and the 151-Pokémon
 * dataset, and produces the top 3-5 candidates for subsequent structured judgment (JEV).
 *
 * IMPORTANT DISTINCTION:
 * Dimension weights represent USER SITUATIONAL NEED INTENSITY ("How urgently does this situation
 * call for a companion with this strength?"), NOT a personality score or psychometric test of the user.
 *
 * SCORING METRIC:
 * - Match score is an explainable ranking heuristic, NOT a probability or psychological certainty.
 * - Score formula:
 *     rawScore = sum(userNeedWeight * pokemonDimensionRating)
 *     maxPossible = sum(userNeedWeight * 5)
 *     normalizedScore = round((rawScore / maxPossible) * 100, 1)  (Scale: 0 - 100)
 *
 * MATCHED DIMENSIONS:
 * Each candidate reports their strongest matching dimensions, ordered by absolute contribution
 * (userNeedWeight * pokemonDimensionRating), providing transparent auditability for JEV.
 */

import { MATCHING_DIMENSIONS } from "./dimensions.ts";
import type { MatchingDimension } from "./dimensions.ts";
import type { PokemonRecord } from "../../types/pokemon.ts";

export type UserSituationNeedProfile = {
  dimensionWeights: Record<MatchingDimension, number>;
};

export interface MatchedDimensionDetail {
  dimension: MatchingDimension;
  userNeedWeight: number;      // 1 to 5
  pokemonRating: number;       // 1 to 5
  contribution: number;        // userNeedWeight * pokemonRating (1 to 25)
}

export interface CandidateCard {
  id: number;
  name: string;
  deterministicScore: number;  // 0 - 100 normalized ranking heuristic
  matchedDimensions: MatchedDimensionDetail[];
  archetype: string;
  strengths: string[];
  blindSpot: string;
  dimensionRatings: Record<MatchingDimension, number>;
}

export class MatchingValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MatchingValidationError";
  }
}

/**
 * Validates that the input user situation profile contains exactly the 6 required
 * dimensions, and that all weights are valid integers in the [1, 5] range.
 * Zero and negative values are strictly prohibited.
 */
export function validateSituationProfile(profile: unknown): asserts profile is UserSituationNeedProfile {
  if (!profile || typeof profile !== "object") {
    throw new MatchingValidationError("User situation profile must be a non-null object.");
  }

  const p = profile as Record<string, unknown>;
  if (!p.dimensionWeights || typeof p.dimensionWeights !== "object") {
    throw new MatchingValidationError("User situation profile must contain a 'dimensionWeights' object.");
  }

  const weights = p.dimensionWeights as Record<string, unknown>;
  const keys = Object.keys(weights);

  if (keys.length !== MATCHING_DIMENSIONS.length) {
    throw new MatchingValidationError(
      `Expected exactly ${MATCHING_DIMENSIONS.length} dimension weights, got ${keys.length}.`
    );
  }

  for (const dim of MATCHING_DIMENSIONS) {
    const val = weights[dim];
    if (typeof val !== "number" || !Number.isInteger(val)) {
      throw new MatchingValidationError(`Dimension weight '${dim}' must be an integer. Got: ${String(val)}`);
    }
    if (val < 1 || val > 5) {
      throw new MatchingValidationError(
        `Dimension weight '${dim}' must be between 1 and 5. Got: ${val}. Zero and negative values are not allowed.`
      );
    }
  }
}

/**
 * Validates a dataset of Pokémon records before running scoring.
 */
export function validatePokemonDataset(dataset: unknown): asserts dataset is PokemonRecord[] {
  if (!Array.isArray(dataset)) {
    throw new MatchingValidationError("Pokémon dataset must be an array.");
  }
  if (dataset.length === 0) {
    throw new MatchingValidationError("Pokémon dataset cannot be empty.");
  }

  const seenIds = new Set<number>();
  for (let i = 0; i < dataset.length; i++) {
    const p = dataset[i] as PokemonRecord;
    if (!p || typeof p.id !== "number" || !p.name || !p.productInterpretation?.dimensionRatings) {
      throw new MatchingValidationError(`Pokémon at index ${i} has invalid record structure.`);
    }
    if (seenIds.has(p.id)) {
      throw new MatchingValidationError(`Duplicate Pokémon ID detected in dataset: ${p.id}`);
    }
    seenIds.add(p.id);
  }
}

/**
 * Calculates raw score, max possible score, normalized score (0-100), and breakdown details.
 */
function evaluatePokemonMatch(
  profile: UserSituationNeedProfile,
  pokemon: PokemonRecord
): {
  normalizedScore: number;
  rawScore: number;
  matchedDimensions: MatchedDimensionDetail[];
  strongMatchCount: number;
} {
  let rawScore = 0;
  let maxPossible = 0;
  let strongMatchCount = 0;

  const matchedDimensions: MatchedDimensionDetail[] = [];

  for (const dim of MATCHING_DIMENSIONS) {
    const userNeed = profile.dimensionWeights[dim];
    const pokeRating = pokemon.productInterpretation.dimensionRatings[dim];
    
    // Weighted accuracy: penalize distance between what situation needs and what pokemon provides,
    // weighted by how urgent the situation need is (userNeed).
    // Maximum distance is 4 (e.g. need 5 vs rating 1).
    // proximity is (4 - |userNeed - pokeRating|), ranging from 0 (opposite) to 4 (perfect match).
    const proximity = 4 - Math.abs(userNeed - pokeRating);
    const contribution = userNeed * proximity;

    rawScore += contribution;
    maxPossible += userNeed * 4; // When proximity = 4 for all dimensions

    // A dimension is considered a strong match if Pokémon rating is 4 or 5 and within 1 of need
    if (pokeRating >= 4 && Math.abs(userNeed - pokeRating) <= 1) {
      strongMatchCount++;
    }

    matchedDimensions.push({
      dimension: dim,
      userNeedWeight: userNeed,
      pokemonRating: pokeRating,
      contribution,
    });
  }

  // Sort matched dimensions descending by contribution (highest leverage first),
  // then descending by pokemonRating
  matchedDimensions.sort((a, b) => {
    if (b.contribution !== a.contribution) {
      return b.contribution - a.contribution;
    }
    return b.pokemonRating - a.pokemonRating;
  });

  const normalizedScore = Number(((rawScore / maxPossible) * 100).toFixed(1));

  return {
    normalizedScore,
    rawScore,
    matchedDimensions,
    strongMatchCount,
  };
}

/**
 * Ranks all Pokémon in the dataset according to the situation's dimension needs.
 *
 * Deterministic Tie-Breaking Rules:
 * 1. Normalized match score (descending)
 * 2. Count of strongly matched dimensions (rating >= 4) (descending)
 * 3. Highest Pokémon rating on the user's highest-need dimension(s) (descending)
 * 4. Stable Pokémon ID (ascending) as final deterministic fallback.
 *
 * Popularity, type, and lore favorites NEVER influence scoring or ranking.
 */
export function rankCandidates(
  profile: UserSituationNeedProfile,
  dataset: PokemonRecord[],
  topK: number = 5
): CandidateCard[] {
  // 1. Strict input validation
  validateSituationProfile(profile);
  validatePokemonDataset(dataset);

  if (typeof topK !== "number" || topK < 1) {
    throw new MatchingValidationError(`topK must be a positive integer, got: ${topK}`);
  }

  // Find user's highest-need dimensions for tie-breaking step 3
  let maxNeed = -1;
  const highestNeedDimensions: MatchingDimension[] = [];
  for (const dim of MATCHING_DIMENSIONS) {
    const need = profile.dimensionWeights[dim];
    if (need > maxNeed) {
      maxNeed = need;
      highestNeedDimensions.length = 0;
      highestNeedDimensions.push(dim);
    } else if (need === maxNeed) {
      highestNeedDimensions.push(dim);
    }
  }

  // 2. Score every candidate
  const evaluated = dataset.map((poke) => {
    const evalResult = evaluatePokemonMatch(profile, poke);

    // Sum Pokémon ratings on user's highest-priority dimension(s) for tie-breaking
    const priorityRatingSum = highestNeedDimensions.reduce(
      (acc, dim) => acc + poke.productInterpretation.dimensionRatings[dim],
      0
    );

    return {
      pokemon: poke,
      ...evalResult,
      priorityRatingSum,
    };
  });

  // 3. Deterministic Sort
  evaluated.sort((a, b) => {
    // Rule 1: Normalized score
    if (b.normalizedScore !== a.normalizedScore) {
      return b.normalizedScore - a.normalizedScore;
    }

    // Rule 2: Count of strongly matched dimensions (ratings >= 4)
    if (b.strongMatchCount !== a.strongMatchCount) {
      return b.strongMatchCount - a.strongMatchCount;
    }

    // Rule 3: Pokémon strength on user's highest-need dimension(s)
    if (b.priorityRatingSum !== a.priorityRatingSum) {
      return b.priorityRatingSum - a.priorityRatingSum;
    }

    // Rule 4: Stable Pokémon ID ascending (no random or locale differences)
    return a.pokemon.id - b.pokemon.id;
  });

  // 4. Return top-K compact candidate representations
  const selected = evaluated.slice(0, Math.min(topK, dataset.length));

  return selected.map((item) => ({
    id: item.pokemon.id,
    name: item.pokemon.name,
    deterministicScore: item.normalizedScore,
    matchedDimensions: item.matchedDimensions,
    archetype: item.pokemon.productInterpretation.archetype,
    strengths: [...item.pokemon.productInterpretation.strengths],
    blindSpot: item.pokemon.productInterpretation.blindSpot,
    dimensionRatings: { ...item.pokemon.productInterpretation.dimensionRatings },
  }));
}
