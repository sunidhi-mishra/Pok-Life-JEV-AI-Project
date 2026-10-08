/**
 * End-to-End Test Suite for PokéLife API Orchestration Pipeline
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { executeMatchPipeline } from "./orchestrator.ts";
import { POST } from "../../app/api/match/route.ts";
import { AIProviderError } from "../../types/ai.ts";
import type { MatchApiResponseSuccess, MatchApiResponseError } from "../../types/api.ts";
import { GrokClient } from "../ai/grok.ts";
import { JevClient } from "../ai/jev.ts";

describe("PokéLife Match API Pipeline Orchestration Suite", () => {
  const sampleValidSituation =
    "I have been working on a difficult project for months. Progress is slow, and I'm starting to lose motivation. I need to decide whether to keep pushing or change my approach.";

  // --------------------------------------------------------------------------
  // 1. Success Path & Complete Flow
  // --------------------------------------------------------------------------
  it("1. Valid situation returns 200 with success: true and full match result", async () => {
    const res = await executeMatchPipeline(
      { situation: sampleValidSituation },
      { mockMode: true }
    );

    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.stageReached, "RESPONSE_VALIDATION");

    const data = res.data as MatchApiResponseSuccess;
    assert.ok(data.result.pokemon.id >= 1 && data.result.pokemon.id <= 151);
    assert.ok(typeof data.result.pokemon.name === "string");
    assert.ok(Array.isArray(data.result.pokemon.types));
    assert.ok(typeof data.result.pokemon.archetype === "string");
    assert.ok(data.result.pokemon.strengths.length >= 2);
    assert.ok(typeof data.result.pokemon.blindSpot === "string");

    assert.ok(typeof data.result.match.deterministicScore === "number");
    assert.ok(data.result.match.matchedDimensions.length === 6);
    assert.ok(typeof data.result.match.confidence === "number");

    assert.ok(typeof data.result.ashTake === "string" && data.result.ashTake.length > 10);
    assert.ok(typeof data.result.mistyTake === "string" && data.result.mistyTake.length > 10);
    assert.ok(typeof data.result.whyThisPokemon === "string" && data.result.whyThisPokemon.length > 10);
  });

  // --------------------------------------------------------------------------
  // 2. Input Validation Bounds & Rejections
  // --------------------------------------------------------------------------
  it("2. Empty situation returns 400", async () => {
    const res = await executeMatchPipeline({ situation: "" }, { mockMode: true });
    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    assert.equal((res.data as MatchApiResponseError).error.code, "INVALID_INPUT");
  });

  it("3. Whitespace-only situation returns 400", async () => {
    const res = await executeMatchPipeline({ situation: "   \n\t   " }, { mockMode: true });
    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    assert.equal((res.data as MatchApiResponseError).error.code, "INVALID_INPUT");
  });

  it("4. Missing situation returns 400", async () => {
    const res = await executeMatchPipeline({}, { mockMode: true });
    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    assert.equal((res.data as MatchApiResponseError).error.code, "INVALID_INPUT");
  });

  it("5. Non-string situation returns 400", async () => {
    const res = await executeMatchPipeline({ situation: 12345 }, { mockMode: true });
    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    assert.equal((res.data as MatchApiResponseError).error.code, "INVALID_INPUT");
  });

  it("6. Rejects client attempts to inject control parameters", async () => {
    const res = await executeMatchPipeline(
      {
        situation: "Valid situation text describing a career challenge.",
        pokemonId: 25, // Prohibited control key
      },
      { mockMode: true }
    );
    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    assert.ok((res.data as MatchApiResponseError).error.message.includes("pokemonId"));
  });

  // --------------------------------------------------------------------------
  // 3. Pipeline Separation & Component Boundaries
  // --------------------------------------------------------------------------
  it("7. Deterministic matcher receives exactly the six expected dimensions and outputs 5 candidates", async () => {
    // Intercept with mock and assert data flow
    let capturedCandidatesCount = 0;
    const customJev: any = {
      selectBestCandidate: async (input: any) => {
        capturedCandidatesCount = input.candidates.length;
        assert.equal(Object.keys(input.dimensionWeights).length, 6);
        return { selectedPokemonId: input.candidates[0].id, confidence: 0.9 };
      },
    };

    const stubGrok: any = {
      analyzeSituation: async () => ({
        situationSummary: "Challenging career move.",
        dimensionWeights: { confidence: 4, persistence: 3, adaptability: 4, courage: 4, patience: 3, calm: 3 },
      }),
      generateExplanation: async () => ({
        ashTake: "Let's do this!",
        mistyTake: "Stay sharp.",
        whyThisPokemon: "A fitting match.",
      }),
    };

    const res = await executeMatchPipeline(
      { situation: sampleValidSituation },
      { mockMode: false, jevClient: customJev, grokClient: stubGrok }
    );

    // In this custom test with mock, verify captured candidate count is 5
    assert.equal(capturedCandidatesCount, 5);
  });

  it("8. JEV receives only the shortlist of 5 candidates, NEVER all 151", async () => {
    let receivedCandidateIds: number[] = [];
    const customJev: any = {
      selectBestCandidate: async (input: any) => {
        receivedCandidateIds = input.candidates.map((c: any) => c.id);
        return { selectedPokemonId: input.candidates[0].id, confidence: 0.85 };
      },
    };

    const stubGrok: any = {
      analyzeSituation: async () => ({
        situationSummary: "Challenging career move.",
        dimensionWeights: { confidence: 4, persistence: 3, adaptability: 4, courage: 4, patience: 3, calm: 3 },
      }),
      generateExplanation: async () => ({
        ashTake: "Let's do this!",
        mistyTake: "Stay sharp.",
        whyThisPokemon: "A fitting match.",
      }),
    };

    await executeMatchPipeline(
      { situation: sampleValidSituation },
      { mockMode: false, jevClient: customJev, grokClient: stubGrok }
    );

    assert.equal(receivedCandidateIds.length, 5);
    assert.ok(receivedCandidateIds.length < 151);
  });

  it("9. JEV selection outside the shortlist is strictly rejected with 422", async () => {
    const outOfBoundsJev: any = {
      selectBestCandidate: async (input: any) => {
        // Deliberately pick an ID not in the 5 candidates
        const nonShortlistId = [1, 2, 3, 4, 5, 6].find(
          (id) => !input.candidates.some((c: any) => c.id === id)
        )!;
        return { selectedPokemonId: nonShortlistId, confidence: 0.9 };
      },
    };

    const stubGrok: any = {
      analyzeSituation: async () => ({
        situationSummary: "Challenging career move.",
        dimensionWeights: { confidence: 4, persistence: 3, adaptability: 4, courage: 4, patience: 3, calm: 3 },
      }),
    };

    const res = await executeMatchPipeline(
      { situation: sampleValidSituation },
      { mockMode: false, jevClient: outOfBoundsJev, grokClient: stubGrok }
    );

    assert.equal(res.status, 422);
    assert.equal(res.data.success, false);
    assert.equal((res.data as MatchApiResponseError).error.code, "JUDGMENT_FAILED");
  });

  it("10. Authoritative Pokémon is resolved from local pokemon151.json dataset", async () => {
    const res = await executeMatchPipeline(
      { situation: sampleValidSituation },
      { mockMode: true }
    );

    assert.equal(res.status, 200);
    const data = res.data as MatchApiResponseSuccess;
    // Canonical categories in local dataset:
    assert.ok(data.result.pokemon.category.includes("Pokémon"));
    assert.ok(data.result.pokemon.types.length >= 1);
  });

  it("11. Final Grok cannot change the Pokémon selected by JEV", async () => {
    let pokemonPassedToExplanation: number | null = null;
    const customGrok: any = {
      analyzeSituation: async () => ({
        situationSummary: "Challenging career move.",
        dimensionWeights: { confidence: 4, persistence: 3, adaptability: 4, courage: 4, patience: 3, calm: 3 },
      }),
      generateExplanation: async (input: any) => {
        pokemonPassedToExplanation = input.selectedPokemon.id;
        return {
          ashTake: "Let's go!",
          mistyTake: "Think it through.",
          whyThisPokemon: "A great fit for this journey.",
        };
      },
    };

    const customJev: any = {
      selectBestCandidate: async (input: any) => {
        return { selectedPokemonId: input.candidates[2].id, confidence: 0.88 }; // Pick 3rd candidate
      },
    };

    const res = await executeMatchPipeline(
      { situation: sampleValidSituation },
      { mockMode: false, grokClient: customGrok, jevClient: customJev }
    );

    assert.equal(res.status, 200);
    const data = res.data as MatchApiResponseSuccess;
    assert.equal(pokemonPassedToExplanation, data.result.pokemon.id);
  });

  // --------------------------------------------------------------------------
  // 4. Failure Isolation & Error Handlers
  // --------------------------------------------------------------------------
  it("12. Invalid Grok situation analysis stops the pipeline immediately", async () => {
    const faultyGrok: any = {
      analyzeSituation: async () => {
        throw new AIProviderError("grok", "INVALID_OUTPUT", "Grok returned non-JSON");
      },
    };

    const res = await executeMatchPipeline(
      { situation: sampleValidSituation },
      { mockMode: false, grokClient: faultyGrok }
    );

    assert.equal(res.status, 502);
    assert.equal(res.stageReached, "GROK_ANALYSIS");
    assert.equal(res.data.success, false);
    assert.equal((res.data as MatchApiResponseError).error.code, "AI_ANALYSIS_FAILED");
  });

  it("13. Missing API keys in real mode produces 503 error without crashing", async () => {
    // Force mockMode to false without keys
    const savedGrok = process.env.GROK_API_KEY;
    const savedJev = process.env.JEV_API_KEY;
    delete process.env.GROK_API_KEY;
    delete process.env.JEV_API_KEY;

    try {
      const res = await executeMatchPipeline(
        { situation: sampleValidSituation },
        { mockMode: false }
      );

      assert.equal(res.status, 503);
      assert.equal(res.data.success, false);
      assert.equal((res.data as MatchApiResponseError).error.code, "INTERNAL_ERROR");
    } finally {
      if (savedGrok) process.env.GROK_API_KEY = savedGrok;
      if (savedJev) process.env.JEV_API_KEY = savedJev;
    }
  });

  it("14. Real provider failure does NOT silently switch to mock mode", async () => {
    const failingGrok: any = {
      analyzeSituation: async () => {
        throw new AIProviderError("grok", "API_ERROR", "xAI 500 error");
      },
    };

    const res = await executeMatchPipeline(
      { situation: sampleValidSituation },
      { mockMode: false, grokClient: failingGrok }
    );

    assert.equal(res.status, 502);
    assert.equal(res.data.success, false);
    // Verifies it did NOT fall back to mock data:
    assert.equal((res.data as MatchApiResponseError).error.code, "AI_ANALYSIS_FAILED");
  });

  // --------------------------------------------------------------------------
  // 5. Next.js App Router HTTP Handler (POST /api/match)
  // --------------------------------------------------------------------------
  it("15. POST handler processes Request object and returns Response with JSON", async () => {
    const req = new Request("http://localhost:3000/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ situation: sampleValidSituation }),
    });

    const response = await POST(req);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Content-Type"), "application/json");

    const json = await response.json();
    assert.equal(json.success, true);
    assert.ok(json.result.pokemon.name);
  });

  it("16. POST handler handles malformed non-JSON body with 400", async () => {
    const req = new Request("http://localhost:3000/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not a json string",
    });

    const response = await POST(req);
    assert.equal(response.status, 400);

    const json = await response.json();
    assert.equal(json.success, false);
    assert.equal(json.error.code, "INVALID_INPUT");
  });
});
