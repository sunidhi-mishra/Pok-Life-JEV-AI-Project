import type { MatchingDimension } from "../lib/matching/dimensions.ts";

export interface CanonicalPokemonData {
  category: string;       // e.g. "Seed Pokémon", "Flame Pokémon"
  generation: 1;          // Strictly 1 for MVP
  types: [string] | [string, string]; // 1 or 2 canonical types
}

export interface ProductInterpretation {
  archetype: string;      // e.g. "The Patient Builder"
  strengths: [string, string] | [string, string, string]; // 2-3 key positive traits
  blindSpot: string;      // 1 notable growth trap or blindspot
  dimensionRatings: Record<MatchingDimension, number>; // 1-5 integer ratings
}

export interface PokemonRecord {
  id: number;             // 1-151
  name: string;           // Canonical English name
  canonical: CanonicalPokemonData;
  productInterpretation: ProductInterpretation;
}
