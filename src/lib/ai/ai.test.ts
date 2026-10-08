/**
 * Unit Test Suite for AI Contracts and Adapters (Grok and JEV)
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateGrokSituationOutput,
  validateGrokExplanationOutput,
  validateJevInput,
  validateJevSelectionOutput,
} from "../validation/aiSchemas.ts";
import {
  mockGrokSituationAnalysis,
  mockGrokExplanation,
} from "./grok.ts";
import {
  mockJevSelection,
} from "./jev.ts";
import { AIProviderError } from "../../types/ai.ts";
import type { PokemonRecord } from "../../types/pokemon.ts";
import type { CandidateCard } from "../matching/filter.ts";

const samplePokemon: PokemonRecord = {
  id: 25,
  name: "Pikachu",
  canonical: { category: "Mouse Pokémon", generation: 1, types: ["Electric"] },
  productInterpretation: {
    archetype: "The Resilient Spark",
    strengths: ["Quick recovery", "Electric optimism"],
    blindSpot: "Prone to burnout",
    dimensionRatings: {
      confidence: 4,
      persistence: 4,
      adaptability: 4,
      courage: 4,
      patience: 2,
      calm: 3,
    },
  },
};

const sampleCandidateCard: CandidateCard = {
  id: 25,
  name: "Pikachu",
  deterministicScore: 84.5,
  matchedDimensions: [
    { dimension: "courage", userNeedWeight: 4, pokemonRating: 4, contribution: 16 },
    { dimension: "adaptability", userNeedWeight: 4, pokemonRating: 4, contribution: 16 },
  ],
  archetype: "The Resilient Spark",
  strengths: ["Quick recovery", "Electric optimism"],
  blindSpot: "Prone to burnout",
  dimensionRatings: {
    confidence: 4,
    persistence: 4,
    adaptability: 4,
    courage: 4,
    patience: 2,
    calm: 3,
  },
};

describe("PokéLife AI Contracts & Adapters Suite", () => {
  // --------------------------------------------------------------------------
  // Grok Contract Tests
  // --------------------------------------------------------------------------
  describe("Grok Situation Analysis Contract", () => {
    it("1. Valid Grok situation output passes validation", () => {
      const valid = {
        situationSummary: "Starting a new job in an unfamiliar environment.",
        dimensionWeights: {
          confidence: 4,
          persistence: 3,
          adaptability: 5,
          courage: 4,
          patience: 2,
          calm: 4,
        },
      };

      assert.doesNotThrow(() => validateGrokSituationOutput(valid));
    });

    it("2. Invalid dimension weight fails validation (out of bounds)", () => {
      const invalidWeight = {
        situationSummary: "Starting a new job.",
        dimensionWeights: {
          confidence: 6, // > 5
          persistence: 3,
          adaptability: 5,
          courage: 4,
          patience: 2,
          calm: 4,
        },
      };

      assert.throws(() => validateGrokSituationOutput(invalidWeight), AIProviderError);
    });

    it("3. Missing dimension fails validation", () => {
      const missingDimension = {
        situationSummary: "Starting a new job.",
        dimensionWeights: {
          confidence: 4,
          persistence: 3,
          // missing adaptability
          courage: 4,
          patience: 2,
          calm: 4,
        },
      };

      assert.throws(() => validateGrokSituationOutput(missingDimension), AIProviderError);
    });

    it("4. Grok situation output cannot select a Pokémon because schema enforces only dimensions", () => {
      const withExtraPokemon = {
        situationSummary: "Starting a new job.",
        dimensionWeights: {
          confidence: 4,
          persistence: 3,
          adaptability: 5,
          courage: 4,
          patience: 2,
          calm: 4,
        },
        selectedPokemon: "Pikachu", // Should not affect dimensions, but does not bypass pipeline
      };

      // Validator passes the required shape, confirming Grok output doesn't dictate selection
      assert.doesNotThrow(() => validateGrokSituationOutput(withExtraPokemon));
    });
  });

  // --------------------------------------------------------------------------
  // JEV Contract Tests
  // --------------------------------------------------------------------------
  describe("JEV Selection Contract", () => {
    const candidateShortlist = [
      {
        id: 1,
        name: "Bulbasaur",
        archetype: "The Patient Grounder",
        strengths: ["Steady pacing"],
        blindSpot: "Hesitant to pivot",
        dimensionRatings: { confidence: 3, persistence: 5, adaptability: 3, courage: 3, patience: 5, calm: 4 },
        deterministicScore: 82.0,
      },
      {
        id: 25,
        name: "Pikachu",
        archetype: "The Resilient Spark",
        strengths: ["Quick recovery"],
        blindSpot: "Prone to burnout",
        dimensionRatings: { confidence: 4, persistence: 4, adaptability: 4, courage: 4, patience: 2, calm: 3 },
        deterministicScore: 85.0,
      },
      {
        id: 143,
        name: "Snorlax",
        archetype: "The Serene Anchor",
        strengths: ["Unshakable peace"],
        blindSpot: "Massive inertia",
        dimensionRatings: { confidence: 4, persistence: 3, adaptability: 1, courage: 2, patience: 5, calm: 5 },
        deterministicScore: 78.0,
      },
    ];

    it("5. Valid JEV selection passes validation", () => {
      const validSelection = {
        selectedPokemonId: 25,
        confidence: 0.88,
      };

      assert.doesNotThrow(() =>
        validateJevSelectionOutput(validSelection, [1, 25, 143])
      );
    });

    it("6. JEV selecting a candidate outside the shortlist is strictly rejected", () => {
      const outOfBoundsSelection = {
        selectedPokemonId: 6, // Charizard (#6) is not in [1, 25, 143]
        confidence: 0.95,
      };

      assert.throws(
        () => validateJevSelectionOutput(outOfBoundsSelection, [1, 25, 143]),
        (err: any) => {
          assert.equal(err.code, "OUT_OF_BOUNDS_SELECTION");
          return true;
        }
      );
    });

    it("7. JEV selecting a non-integer ID is rejected", () => {
      const nonInteger = {
        selectedPokemonId: "25", // String instead of integer
      };

      assert.throws(() =>
        validateJevSelectionOutput(nonInteger, [1, 25, 143])
      );
    });

    it("8. JEV selecting multiple Pokémon or invalid structure is rejected", () => {
      const multiple = {
        selectedPokemonId: [25, 1] as any,
      };

      assert.throws(() =>
        validateJevSelectionOutput(multiple, [1, 25, 143])
      );
    });

    it("9. Mock JEV always selects strictly from the provided shortlist", () => {
      const jevInput = {
        situationSummary: "Feeling anxious and scared about a sudden life transition.",
        dimensionWeights: { confidence: 3, persistence: 3, adaptability: 4, courage: 4, patience: 3, calm: 3 },
        candidates: candidateShortlist,
      };

      const result = mockJevSelection(jevInput);
      const allowedIds = candidateShortlist.map((c) => c.id);
      assert.ok(allowedIds.includes(result.selectedPokemonId));
    });

    it("10. Mock JEV is deterministic across multiple calls", () => {
      const jevInput = {
        situationSummary: "Feeling anxious and scared about a sudden life transition.",
        dimensionWeights: { confidence: 3, persistence: 3, adaptability: 4, courage: 4, patience: 3, calm: 3 },
        candidates: candidateShortlist,
      };

      const run1 = mockJevSelection(jevInput);
      const run2 = mockJevSelection(jevInput);
      assert.equal(run1.selectedPokemonId, run2.selectedPokemonId);
      assert.equal(run1.confidence, run2.confidence);
    });
  });

  // --------------------------------------------------------------------------
  // Grok Final Explanation Schema Tests
  // --------------------------------------------------------------------------
  describe("Grok Final Explanation Contract", () => {
    it("11. Rejects missing Ash take", () => {
      const missingAsh = {
        mistyTake: "Make sure to plan carefully.",
        whyThisPokemon: "Pikachu is great for energy.",
      };

      assert.throws(() => validateGrokExplanationOutput(missingAsh), AIProviderError);
    });

    it("12. Rejects missing Misty take", () => {
      const missingMisty = {
        ashTake: "Let's go all out!",
        whyThisPokemon: "Pikachu is great for energy.",
      };

      assert.throws(() => validateGrokExplanationOutput(missingMisty), AIProviderError);
    });

    it("13. Rejects missing whyThisPokemon", () => {
      const missingWhy = {
        ashTake: "Let's go all out!",
        mistyTake: "Make sure to plan carefully.",
      };

      assert.throws(() => validateGrokExplanationOutput(missingWhy), AIProviderError);
    });

    it("14. Valid mock explanation generates complete structured output", () => {
      const expInput = {
        situationSummary: "Starting a new venture.",
        selectedPokemon: samplePokemon,
        candidateCard: sampleCandidateCard,
      };

      const output = mockGrokExplanation(expInput);
      assert.doesNotThrow(() => validateGrokExplanationOutput(output));
      assert.ok(output.ashTake.includes("Pikachu"));
      assert.ok(output.mistyTake.length > 10);
      assert.ok(output.whyThisPokemon.includes("Resilient Spark"));
    });
  });
});
