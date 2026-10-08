/**
 * Unit Tests for Deterministic Input Quality Gate & Credit-Safety Protection
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  checkInputQuality,
  INVALID_SITUATION_USER_MESSAGE,
  GREETING_USER_MESSAGE,
  META_QUERY_USER_MESSAGE,
} from "./qualityGate.ts";
import { validateMatchApiInput, ApiInputValidationError } from "./apiInput.ts";
import { executeMatchPipeline } from "../orchestration/orchestrator.ts";
import { GrokClient } from "../ai/grok.ts";
import { JevClient } from "../ai/jev.ts";

describe("Deterministic Input Quality Gate Suite", () => {
  // --------------------------------------------------------------------------
  // 1. Must Reject Obvious Nonsense & Keyboard-Smash
  // --------------------------------------------------------------------------
  describe("Nonsense and Keyboard-Smash Rejection", () => {
    const requiredRejections = [
      { text: "kfhgjjh;j;j;oj", label: "User reported case: alternating semicolon consonant smash" },
      { text: "asdfghjkl", label: "Home-row QWERTY walk" },
      { text: "qwertyuiop", label: "Top-row QWERTY walk" },
      { text: "zxczxczxc", label: "Repeated 3-char sequence" },
      { text: "123456789", label: "Numeric walk sequence" },
      { text: "!!!!!!!!!!!!", label: "Punctuation-only string" },
      { text: "aaaaaaaaaaaaaaa", label: "Excessive single character repetition" },
      { text: "....,,,,;;;;", label: "Symbol/punctuation mash" },
      { text: "fjskl23@@@###", label: "Consonant and symbol dominated mash" },
      { text: "qwertzuiopasdfg", label: "Multi-row keyboard walk" },
      { text: "cvbnmcvbnm", label: "Repeated bottom-row keyboard walk" },
      { text: "bcdfghjklmn", label: "Consonant-only string with no vowels" },
      { text: "zzz zzz zzz zzz", label: "Low lexical diversity repeated token" },
      { text: "123 456 789 000", label: "Numbers only" },
      { text: "!@#$%^&*()", label: "Shift-number symbols" },
    ];

    for (const { text, label } of requiredRejections) {
      it(`Rejects: "${text}" (${label})`, () => {
        const result = checkInputQuality(text);
        assert.equal(result.isValid, false, `Expected "${text}" to be invalid`);
        assert.ok(result.reason, "Expected a rejection reason");
        assert.equal(result.userMessage, INVALID_SITUATION_USER_MESSAGE);
      });
    }
  });

  // --------------------------------------------------------------------------
  // 2. Must Reject Casual Greetings, Meta-Queries & Low Semantic Repetitions
  // --------------------------------------------------------------------------
  describe("Irrelevant Input Rejections (Greetings, Meta-queries, Repetitions)", () => {
    const irrelevantInputs = [
      { text: "helohello hello", expectedMsg: INVALID_SITUATION_USER_MESSAGE, reason: "Repeated stem without diversity" },
      { text: "hello", expectedMsg: GREETING_USER_MESSAGE, reason: "Single greeting" },
      { text: "hi there", expectedMsg: GREETING_USER_MESSAGE, reason: "Multi-token greeting" },
      { text: "hey what's up", expectedMsg: GREETING_USER_MESSAGE, reason: "Slang greeting" },
      { text: "good morning", expectedMsg: GREETING_USER_MESSAGE, reason: "Time-of-day greeting" },
      { text: "test test test", expectedMsg: GREETING_USER_MESSAGE, reason: "Test probe greeting" },
      { text: "who are you?", expectedMsg: META_QUERY_USER_MESSAGE, reason: "System probe meta-query" },
      { text: "what can you do", expectedMsg: META_QUERY_USER_MESSAGE, reason: "Capability meta-query" },
      { text: "how does this work?", expectedMsg: META_QUERY_USER_MESSAGE, reason: "Explanation meta-query" },
      { text: "pizza and burgers", expectedMsg: INVALID_SITUATION_USER_MESSAGE, reason: "Generic nouns with no situational dilemma" },
      { text: "blue sky today", expectedMsg: INVALID_SITUATION_USER_MESSAGE, reason: "Random observation with no dilemma" },
    ];

    for (const { text, expectedMsg, reason } of irrelevantInputs) {
      it(`Rejects irrelevant input: "${text}" (${reason})`, () => {
        const result = checkInputQuality(text);
        assert.equal(result.isValid, false, `Expected "${text}" to be rejected`);
        assert.equal(result.userMessage, expectedMsg);
      });
    }
  });

  // --------------------------------------------------------------------------
  // 3. Must Accept Legitimate Short & Normal Natural-Language Inputs
  // --------------------------------------------------------------------------
  describe("Legitimate Natural-Language Acceptance (Zero False Positives)", () => {
    const requiredAcceptances = [
      "I'm lost",
      "I'm confused",
      "I feel stuck",
      "Bad day at work",
      "Need a change",
      "Should I quit?",
      "I'm nervous about moving",
      "I keep overthinking this decision",
      "My project isn't going anywhere",
      "I'm scared to start something new",
      "help",
      "confused",
      "need advice",
      "I'm stuck",
      "bad breakup",
      "new job",
      "should I leave?",
      "I feel so overwhelmed lately",
      "Thinking about quitting my job",
      "Everything feels too fast right now",
    ];

    for (const text of requiredAcceptances) {
      it(`Accepts: "${text}"`, () => {
        const result = checkInputQuality(text);
        assert.equal(result.isValid, true, `Expected legitimate phrase "${text}" to be valid`);
      });
    }
  });

  // --------------------------------------------------------------------------
  // 4. API Input Validation Integration & Error Contract
  // --------------------------------------------------------------------------
  describe("validateMatchApiInput Integration", () => {
    it("Throws ApiInputValidationError with code INPUT_NOT_MEANINGFUL on keyboard-smash", () => {
      assert.throws(
        () => validateMatchApiInput({ situation: "kfhgjjh;j;j;oj" }),
        (err: unknown) => {
          assert.ok(err instanceof ApiInputValidationError);
          assert.equal((err as ApiInputValidationError).code, "INPUT_NOT_MEANINGFUL");
          assert.equal(
            (err as ApiInputValidationError).message,
            INVALID_SITUATION_USER_MESSAGE
          );
          return true;
        }
      );
    });

    it("Throws ApiInputValidationError on greeting 'helohello hello'", () => {
      assert.throws(
        () => validateMatchApiInput({ situation: "helohello hello" }),
        (err: unknown) => {
          assert.ok(err instanceof ApiInputValidationError);
          assert.equal((err as ApiInputValidationError).code, "INPUT_NOT_MEANINGFUL");
          return true;
        }
      );
    });

    it("Passes short meaningful input without error", () => {
      const validated = validateMatchApiInput({ situation: "I'm lost" });
      assert.equal(validated.situation, "I'm lost");
    });
  });

  // --------------------------------------------------------------------------
  // 5. Credit-Safety Test: Proof that Rejected Inputs NEVER Call External AI
  // --------------------------------------------------------------------------
  describe("Credit-Safety Protection: Zero AI Calls for Rejected Inputs", () => {
    it("Rejects 'kfhgjjh;j;j;oj' immediately at stage INPUT_VALIDATION with 400 and zero provider calls", async () => {
      let grokCalls = 0;
      let jevCalls = 0;

      const mockGrokClient = {
        analyzeSituation: async () => {
          grokCalls++;
          throw new Error("Grok should never be called for rejected inputs!");
        },
        generateExplanation: async () => {
          grokCalls++;
          throw new Error("Grok should never be called for rejected inputs!");
        },
      } as unknown as GrokClient;

      const mockJevClient = {
        selectBestCandidate: async () => {
          jevCalls++;
          throw new Error("JEV should never be called for rejected inputs!");
        },
      } as unknown as JevClient;

      const res = await executeMatchPipeline(
        { situation: "kfhgjjh;j;j;oj" },
        {
          mockMode: false,
          grokClient: mockGrokClient,
          jevClient: mockJevClient,
        }
      );

      assert.equal(res.status, 400);
      assert.equal(res.stageReached, "INPUT_VALIDATION");
      assert.equal(res.data.success, false);
      assert.equal((res.data as any).error.code, "INPUT_NOT_MEANINGFUL");
      assert.equal((res.data as any).error.message, INVALID_SITUATION_USER_MESSAGE);
      assert.equal(grokCalls, 0, "Grok was called when it should have been blocked!");
      assert.equal(jevCalls, 0, "JEV was called when it should have been blocked!");
    });

    it("Rejects 'helohello hello' with 0 external AI calls", async () => {
      let anyAiCalled = false;

      const mockGrokClient = {
        analyzeSituation: async () => {
          anyAiCalled = true;
          throw new Error("AI call blocked");
        },
      } as unknown as GrokClient;

      const res = await executeMatchPipeline(
        { situation: "helohello hello" },
        { mockMode: false, grokClient: mockGrokClient }
      );

      assert.equal(res.status, 400);
      assert.equal(res.stageReached, "INPUT_VALIDATION");
      assert.equal(anyAiCalled, false, "External AI was called for greeting repetition!");
    });

    it("Rejects 'who are you?' with 0 external AI calls", async () => {
      let anyAiCalled = false;

      const mockGrokClient = {
        analyzeSituation: async () => {
          anyAiCalled = true;
          throw new Error("AI call blocked");
        },
      } as unknown as GrokClient;

      const res = await executeMatchPipeline(
        { situation: "who are you?" },
        { mockMode: false, grokClient: mockGrokClient }
      );

      assert.equal(res.status, 400);
      assert.equal(res.stageReached, "INPUT_VALIDATION");
      assert.equal(anyAiCalled, false, "External AI was called for meta-query!");
    });
  });
});
