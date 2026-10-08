/**
 * Comprehensive Unit Test Suite for PokéLife Deterministic Matching & Scoring
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  rankCandidates,
  validateSituationProfile,
  validatePokemonDataset,
  MatchingValidationError,
} from './filter.ts';
import type { UserSituationNeedProfile } from './filter.ts';
import type { PokemonRecord } from '../../types/pokemon.ts';
import datasetJson from '../../data/pokemon151.json' with { type: 'json' };

const full151Dataset = datasetJson as PokemonRecord[];

// -------------------------------------------------------------
// Artificial Fixtures for Pure Mathematical Isolation (Task 15)
// -------------------------------------------------------------
const syntheticFixtures: PokemonRecord[] = [
  {
    id: 1001,
    name: "PureConfidenceMon",
    canonical: { category: "Test", generation: 1, types: ["Normal"] },
    productInterpretation: {
      archetype: "The Confident",
      strengths: ["Bravery", "Swagger"],
      blindSpot: "None",
      dimensionRatings: { confidence: 5, persistence: 1, adaptability: 1, courage: 1, patience: 1, calm: 1 }
    }
  },
  {
    id: 1002,
    name: "AntiConfidenceMon",
    canonical: { category: "Test", generation: 1, types: ["Normal"] },
    productInterpretation: {
      archetype: "The Reluctant",
      strengths: ["Hiding", "Silence"],
      blindSpot: "Timidity",
      dimensionRatings: { confidence: 1, persistence: 5, adaptability: 5, courage: 5, patience: 5, calm: 5 }
    }
  },
  {
    id: 1003,
    name: "PureAdaptabilityMon",
    canonical: { category: "Test", generation: 1, types: ["Normal"] },
    productInterpretation: {
      archetype: "The Shifter",
      strengths: ["Speed", "Fluidity"],
      blindSpot: "Chaos",
      dimensionRatings: { confidence: 1, persistence: 1, adaptability: 5, courage: 1, patience: 1, calm: 1 }
    }
  }
];

describe('PokéLife Deterministic Matcher & Scoring Suite', () => {

  // -----------------------------------------------------------
  // 1. Pure Mathematical Scoring & Isolated Fixture Tests
  // -----------------------------------------------------------
  describe('Mathematical Scoring Isolation', () => {
    it('ranks PureConfidenceMon higher when user situation urgently needs confidence', () => {
      const userNeed: UserSituationNeedProfile = {
        dimensionWeights: {
          confidence: 5,
          persistence: 1,
          adaptability: 1,
          courage: 1,
          patience: 1,
          calm: 1
        }
      };

      const results = rankCandidates(userNeed, syntheticFixtures, 3);
      assert.equal(results[0].name, "PureConfidenceMon");
      assert.ok(results[0].deterministicScore > results[1].deterministicScore);
      
      // Check exact formula calculation:
      // PureConfidenceMon:
      //   confidence: userNeed=5, pokeRating=5 => proximity=4 => 5*4 = 20
      //   other 5 dims: userNeed=1, pokeRating=1 => proximity=4 => 1*4 = 4 each => 5 * 4 = 20
      //   rawScore = 20 + 20 = 40
      //   maxPossible = (5*4 + 5*1*4) = 40
      //   normalizedScore = 100.0%
      assert.equal(results[0].deterministicScore, 100.0);
    });

    it('ranks PureAdaptabilityMon higher when user situation urgently needs adaptability', () => {
      const userNeed: UserSituationNeedProfile = {
        dimensionWeights: {
          confidence: 1,
          persistence: 1,
          adaptability: 5,
          courage: 1,
          patience: 1,
          calm: 1
        }
      };

      const results = rankCandidates(userNeed, syntheticFixtures, 3);
      assert.equal(results[0].name, "PureAdaptabilityMon");
      assert.equal(results[0].deterministicScore, 100.0);
    });
  });

  // -----------------------------------------------------------
  // 2. Tests against the Real 151 Pokémon Dataset
  // -----------------------------------------------------------
  describe('Evaluations against Real 151 Pokémon Dataset', () => {
    it('favors high adaptability candidates when adaptability need is dominant', () => {
      const userNeed: UserSituationNeedProfile = {
        dimensionWeights: {
          confidence: 2,
          persistence: 2,
          adaptability: 5,
          courage: 4,
          patience: 2,
          calm: 2
        }
      };

      const topCandidates = rankCandidates(userNeed, full151Dataset, 5);
      assert.equal(topCandidates.length, 5);

      // Verify that all top candidates have strong adaptability (4 or 5)
      topCandidates.forEach(candidate => {
        assert.ok(
          candidate.dimensionRatings.adaptability >= 4,
          `Candidate ${candidate.name} should have adaptability >= 4, got ${candidate.dimensionRatings.adaptability}`
        );
      });
    });

    it('favors high persistence candidates when persistence need is dominant', () => {
      const userNeed: UserSituationNeedProfile = {
        dimensionWeights: {
          confidence: 1,
          persistence: 5,
          adaptability: 1,
          courage: 2,
          patience: 2,
          calm: 1
        }
      };

      const topCandidates = rankCandidates(userNeed, full151Dataset, 5);
      topCandidates.forEach(candidate => {
        assert.ok(
          candidate.dimensionRatings.persistence >= 4,
          `Candidate ${candidate.name} should have persistence >= 4, got ${candidate.dimensionRatings.persistence}`
        );
      });
    });

    it('favors calm and patient profiles when situation calls for calm + patience', () => {
      const userNeed: UserSituationNeedProfile = {
        dimensionWeights: {
          confidence: 1,
          persistence: 2,
          adaptability: 1,
          courage: 1,
          patience: 5,
          calm: 5
        }
      };

      const topCandidates = rankCandidates(userNeed, full151Dataset, 5);
      topCandidates.forEach(candidate => {
        const sum = candidate.dimensionRatings.calm + candidate.dimensionRatings.patience;
        assert.ok(
          sum >= 8,
          `Candidate ${candidate.name} should have combined calm+patience >= 8, got ${sum}`
        );
      });
    });

    it('operates predictably on a balanced/mixed profile', () => {
      const userNeed: UserSituationNeedProfile = {
        dimensionWeights: {
          confidence: 4,
          persistence: 3,
          adaptability: 4,
          courage: 3,
          patience: 3,
          calm: 4
        }
      };

      const topCandidates = rankCandidates(userNeed, full151Dataset, 5);
      assert.equal(topCandidates.length, 5);
      assert.ok(topCandidates[0].deterministicScore >= topCandidates[1].deterministicScore);
      assert.ok(topCandidates[1].deterministicScore >= topCandidates[2].deterministicScore);
    });

    it('handles all dimensions equal deterministically', () => {
      const userNeed: UserSituationNeedProfile = {
        dimensionWeights: {
          confidence: 3,
          persistence: 3,
          adaptability: 3,
          courage: 3,
          patience: 3,
          calm: 3
        }
      };

      const run1 = rankCandidates(userNeed, full151Dataset, 5);
      const run2 = rankCandidates(userNeed, full151Dataset, 5);

      assert.deepEqual(
        run1.map(p => p.id),
        run2.map(p => p.id)
      );
    });
  });

  // -----------------------------------------------------------
  // 3. Top-K and Limit Handling
  // -----------------------------------------------------------
  describe('Top-K Selection Bounds', () => {
    const userNeed: UserSituationNeedProfile = {
      dimensionWeights: { confidence: 3, persistence: 3, adaptability: 3, courage: 3, patience: 3, calm: 3 }
    };

    it('returns exactly K=3 candidates when requested', () => {
      const results = rankCandidates(userNeed, full151Dataset, 3);
      assert.equal(results.length, 3);
    });

    it('returns exactly K=5 candidates by default', () => {
      const results = rankCandidates(userNeed, full151Dataset);
      assert.equal(results.length, 5);
    });

    it('gracefully handles K larger than the dataset size', () => {
      const results = rankCandidates(userNeed, syntheticFixtures, 100);
      assert.equal(results.length, syntheticFixtures.length);
    });

    it('throws error on invalid topK', () => {
      assert.throws(() => {
        rankCandidates(userNeed, full151Dataset, 0);
      }, MatchingValidationError);

      assert.throws(() => {
        rankCandidates(userNeed, full151Dataset, -5);
      }, MatchingValidationError);
    });
  });

  // -----------------------------------------------------------
  // 4. Input Validation & Strict Error Handling
  // -----------------------------------------------------------
  describe('Input Validation & Boundary Checking', () => {
    it('rejects null or non-object input', () => {
      assert.throws(() => validateSituationProfile(null), MatchingValidationError);
      assert.throws(() => validateSituationProfile("invalid"), MatchingValidationError);
    });

    it('rejects profiles missing dimensions', () => {
      const invalid = {
        dimensionWeights: { confidence: 4, persistence: 3 } // missing others
      };
      assert.throws(() => validateSituationProfile(invalid), MatchingValidationError);
    });

    it('rejects zero or negative dimension weights', () => {
      const withZero = {
        dimensionWeights: { confidence: 0, persistence: 3, adaptability: 3, courage: 3, patience: 3, calm: 3 }
      };
      assert.throws(() => validateSituationProfile(withZero), MatchingValidationError);

      const withNegative = {
        dimensionWeights: { confidence: -2, persistence: 3, adaptability: 3, courage: 3, patience: 3, calm: 3 }
      };
      assert.throws(() => validateSituationProfile(withNegative), MatchingValidationError);
    });

    it('rejects weights greater than 5 or non-integers', () => {
      const overMax = {
        dimensionWeights: { confidence: 6, persistence: 3, adaptability: 3, courage: 3, patience: 3, calm: 3 }
      };
      assert.throws(() => validateSituationProfile(overMax), MatchingValidationError);

      const decimal = {
        dimensionWeights: { confidence: 3.5, persistence: 3, adaptability: 3, courage: 3, patience: 3, calm: 3 }
      };
      assert.throws(() => validateSituationProfile(decimal), MatchingValidationError);
    });

    it('rejects NaN or strings as dimension values', () => {
      const withNaN = {
        dimensionWeights: { confidence: NaN, persistence: 3, adaptability: 3, courage: 3, patience: 3, calm: 3 }
      };
      assert.throws(() => validateSituationProfile(withNaN), MatchingValidationError);
    });

    it('rejects invalid or empty dataset', () => {
      const userNeed: UserSituationNeedProfile = {
        dimensionWeights: { confidence: 3, persistence: 3, adaptability: 3, courage: 3, patience: 3, calm: 3 }
      };

      assert.throws(() => rankCandidates(userNeed, [] as any), MatchingValidationError);
      assert.throws(() => rankCandidates(userNeed, [{ id: 1 }] as any), MatchingValidationError);
    });

    it('rejects dataset with duplicate IDs', () => {
      const duplicates = [
        syntheticFixtures[0],
        { ...syntheticFixtures[0] }
      ];
      const userNeed: UserSituationNeedProfile = {
        dimensionWeights: { confidence: 3, persistence: 3, adaptability: 3, courage: 3, patience: 3, calm: 3 }
      };
      assert.throws(() => rankCandidates(userNeed, duplicates), MatchingValidationError);
    });
  });

  // -----------------------------------------------------------
  // 5. Determinism and Absence of Bias
  // -----------------------------------------------------------
  describe('Determinism & Impartiality', () => {
    it('produces identical ordering across 10 repeated runs', () => {
      const userNeed: UserSituationNeedProfile = {
        dimensionWeights: { confidence: 5, persistence: 4, adaptability: 3, courage: 5, patience: 1, calm: 2 }
      };

      const baseline = rankCandidates(userNeed, full151Dataset, 5);
      for (let i = 0; i < 9; i++) {
        const nextRun = rankCandidates(userNeed, full151Dataset, 5);
        assert.deepEqual(
          nextRun.map(p => p.id),
          baseline.map(p => p.id),
          `Run ${i + 2} differed from baseline`
        );
      }
    });

    it('does not give favoritism to Pikachu or Charizard on unaligned profiles', () => {
      // Situation requiring immense calm and patience, where Pikachu/Charizard score low
      const quietNeed: UserSituationNeedProfile = {
        dimensionWeights: { confidence: 1, persistence: 3, adaptability: 1, courage: 1, patience: 5, calm: 5 }
      };

      const results = rankCandidates(quietNeed, full151Dataset, 10);
      const topIds = results.map(r => r.id);

      assert.ok(!topIds.includes(25), "Pikachu (id 25) must not be in top candidates for quiet zen profile");
      assert.ok(!topIds.includes(6), "Charizard (id 6) must not be in top candidates for quiet zen profile");
    });
  });

  // -----------------------------------------------------------
  // 6. Matched Dimensions Explainability Contract (Task 16)
  // -----------------------------------------------------------
  describe('Explainability & Contract Output', () => {
    it('includes complete structured audit details in candidate card', () => {
      const userNeed: UserSituationNeedProfile = {
        dimensionWeights: { confidence: 4, persistence: 5, adaptability: 2, courage: 4, patience: 2, calm: 2 }
      };

      const results = rankCandidates(userNeed, full151Dataset, 1);
      const top = results[0];

      assert.ok(top.id >= 1 && top.id <= 151);
      assert.ok(typeof top.deterministicScore === 'number');
      assert.ok(top.deterministicScore >= 0 && top.deterministicScore <= 100);
      assert.ok(typeof top.archetype === 'string');
      assert.ok(Array.isArray(top.strengths) && top.strengths.length >= 2);
      assert.ok(typeof top.blindSpot === 'string');
      assert.equal(top.matchedDimensions.length, 6);

      // Verify that matchedDimensions are sorted descending by contribution
      for (let i = 0; i < top.matchedDimensions.length - 1; i++) {
        assert.ok(
          top.matchedDimensions[i].contribution >= top.matchedDimensions[i + 1].contribution
        );
      }

      // Check contribution math on the first dimension:
      // contribution = userNeedWeight * (4 - |userNeedWeight - pokemonRating|)
      const first = top.matchedDimensions[0];
      const expectedProximity = 4 - Math.abs(first.userNeedWeight - first.pokemonRating);
      assert.equal(first.contribution, first.userNeedWeight * expectedProximity);
    });
  });
});
