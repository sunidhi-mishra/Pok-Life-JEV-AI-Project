/**
 * Request and Response Contracts for /api/match
 */

import type { PokemonRecord } from "./pokemon.ts";
import type { MatchedDimensionDetail } from "../lib/matching/filter.ts";

export interface MatchApiRequest {
  situation: string;
}

export interface MatchedPokemonView {
  id: number;
  name: string;
  types: string[];
  category: string;
  archetype: string;
  strengths: string[];
  blindSpot: string;
}

export interface MatchMetadataView {
  deterministicScore: number;
  matchedDimensions: MatchedDimensionDetail[];
  confidence?: number;
}

export interface MatchApiResponseSuccess {
  success: true;
  result: {
    pokemon: MatchedPokemonView;
    match: MatchMetadataView;
    ashTake: string;
    mistyTake: string;
    whyThisPokemon: string;
  };
}

export interface MatchApiResponseError {
  success: false;
  error: {
    code:
      | "INVALID_INPUT"
      | "INPUT_NOT_MEANINGFUL"
      | "AI_ANALYSIS_FAILED"
      | "MATCHING_FAILED"
      | "JUDGMENT_FAILED"
      | "POKEMON_NOT_FOUND"
      | "EXPLANATION_FAILED"
      | "INTERNAL_ERROR";
    message: string;
  };
}

export type MatchApiResponse = MatchApiResponseSuccess | MatchApiResponseError;
