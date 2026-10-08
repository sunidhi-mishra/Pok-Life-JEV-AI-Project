/**
 * Deterministic Input Quality Gate for PokéLife
 *
 * Runs BEFORE any external AI calls (Groq, JEV, OpenRouter).
 * Protects AI credits, prevents hallucinated Pokémon for nonsense/keyboard-smash,
 * casual greetings, meta-questions, and low-semantic repetitions,
 * while strictly preserving short, legitimate life dilemma inputs.
 */

export interface QualityGateResult {
  isValid: boolean;
  reason?: string;
  userMessage?: string;
}

export const INVALID_SITUATION_USER_MESSAGE =
  "That doesn't look like a situation yet. Tell me what's actually going on, even if it's messy. (e.g. \"I'm thinking about leaving my job, but I'm scared I'll regret it.\")";

export const GREETING_USER_MESSAGE =
  "That sounds like a greeting! Tell me what's actually going on in your life or what challenge you're facing.";

export const META_QUERY_USER_MESSAGE =
  "I'm here to match you with a Pokémon based on your challenges or life situations. Tell me what's on your mind!";

// Common English vowels (including 'y')
const VOWELS = new Set(["a", "e", "i", "o", "u", "y"]);

// Standard English QWERTY keyboard row adjacency sequences (length >= 5)
const KEYBOARD_SMASH_SEQUENCES = [
  "qwerty",
  "asdfgh",
  "zxcvbn",
  "dfghjk",
  "ghjkl",
  "qwert",
  "werty",
  "ertyu",
  "rtyui",
  "tyuio",
  "yuiop",
  "asdfg",
  "sdfgh",
  "fghjk",
  "zxcvb",
  "xcvbn",
  "cvbnm",
  "12345",
  "23456",
  "34567",
  "45678",
  "56789",
  "67890",
  "!@#$%",
  "@#$%",
  "#$$%",
];

// Conversational greetings and chatty openings (not situations on their own)
const CASUAL_GREETINGS = new Set([
  "hello", "helo", "helllo", "hellllo", "hi", "hey", "heyy", "heyyy", "howdy",
  "yo", "yoo", "sup", "whatsup", "what", "whats", "what's", "up", "good", "morning",
  "evening", "afternoon", "night", "test", "testing", "ping", "hola", "bonjour",
  "namaste", "wassup", "greetings"
]);

// Meta queries that ask about the bot or probe the system rather than describing personal situations
const META_QUERY_PATTERNS = [
  /^(who|what) are you\??$/i,
  /^(what|how) does this work\??$/i,
  /^what can you do\??$/i,
  /^can you talk\??$/i,
  /^tell me a joke\??$/i,
  /^who made you\??$/i,
  /^what is (this|pokelife|pokemon)\??$/i,
  /^are you (ai|a bot|real)\??$/i,
  /^help me\??$/i, // "help me" with nothing else is often handled by dilemma whitelist, but let's see
];

// Situational, emotional, personal reflection, or dilemma trigger markers
const SITUATIONAL_MARKERS = new Set([
  // First-person & stance
  "i", "im", "i'm", "me", "my", "we", "our", "myself", "feeling", "feel", "feels", "felt",
  "thinking", "wondering", "struggling", "trying", "facing", "dealing", "going",
  "need", "want", "should", "cant", "can't", "cannot", "could", "would", "must",
  // Emotions & states
  "lost", "anxious", "anxiety", "stuck", "sad", "down", "scared", "fear", "afraid", "tired",
  "alone", "lonely", "confused", "overwhelmed", "stressed", "stress", "burnout", "burned",
  "depressed", "nervous", "worried", "worry", "doubts", "doubt", "hopeless", "hope",
  "angry", "frustrated", "hurt", "jealous", "guilty", "ashamed", "exhausted", "paralyzed",
  "frozen", "unmotivated", "numb", "imposter", "restless", "bored",
  // Life, work, school, relationships
  "work", "job", "career", "boss", "coworker", "manager", "promotion", "raise", "pay",
  "fired", "fire", "hired", "interview", "interviews", "quit", "leave", "stay", "resigning",
  "school", "college", "university", "exam", "exams", "study", "studying", "grades",
  "test", "tests", "degree", "thesis", "graduating", "dropout",
  "breakup", "ex", "dating", "relationship", "partner", "divorce", "marriage", "crush",
  "friend", "friends", "friendship", "family", "parents", "mom", "dad", "sibling",
  "moving", "move", "city", "house", "apartment", "relocating",
  "decision", "decisions", "choice", "choices", "overthinking", "path", "future", "goals",
  "money", "debt", "financial", "rent", "bills",
  "change", "transition", "starting", "start", "finish", "fail", "failed", "failing",
  "success", "dream", "dreams", "creative", "block", "health", "sick", "grief", "loss",
  "life", "advice", "help", "idk", "dunno", "tbh", "hard", "tough", "bad"
]);

// Normalize token to root/stem for checking repetitions like "helohello hello"
function normalizeTokenStem(word: string): string {
  let cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  // Strip common trailing suffixes for fuzzy equivalence
  cleaned = cleaned.replace(/(ing|ed|s|es|ly|er|est)$/, "");
  // Collapse repeated internal letters (e.g. "helo" vs "hello" -> "helo")
  cleaned = cleaned.replace(/(.)\1+/g, "$1");
  return cleaned;
}

/**
 * Validates whether the user's input represents a meaningful situational dilemma.
 * Deterministic, offline, zero AI credits consumed.
 */
export function checkInputQuality(rawText: string): QualityGateResult {
  const text = (rawText || "").trim();

  // 1. Minimum character requirement (at least 3 non-whitespace characters)
  if (text.length < 3) {
    return {
      isValid: false,
      reason: "TOO_SHORT",
      userMessage: INVALID_SITUATION_USER_MESSAGE,
    };
  }

  // 2. Letters vs non-letters check
  const lettersOnly = text.replace(/[^a-zA-Z]/g, "");
  const lowerText = text.toLowerCase();
  const lowerLetters = lettersOnly.toLowerCase();

  // Must have at least 2 alphabetic characters
  if (lettersOnly.length < 2) {
    return {
      isValid: false,
      reason: "INSUFFICIENT_ALPHA",
      userMessage: INVALID_SITUATION_USER_MESSAGE,
    };
  }

  // 3. Ratio of alphabetic characters to total characters
  // Filters out strings composed primarily of punctuation/numbers/symbols (e.g. "....,,,,;;;;", "123456789", "fjskl23@@@###")
  const alphaRatio = lettersOnly.length / text.length;
  if (alphaRatio < 0.35) {
    return {
      isValid: false,
      reason: "SYMBOL_OR_NUMERIC_DOMINANT",
      userMessage: INVALID_SITUATION_USER_MESSAGE,
    };
  }

  // 4. Check for excessive repeated identical characters (e.g. "aaaaaaaaaaaaaaa", "sooooooo")
  // 5 or more identical consecutive characters is an automatic reject
  if (/(.)\1{4,}/.test(text)) {
    return {
      isValid: false,
      reason: "EXCESSIVE_REPEATED_CHARS",
      userMessage: INVALID_SITUATION_USER_MESSAGE,
    };
  }

  // 5. Meta queries check (probes about AI / system questions)
  for (const pattern of META_QUERY_PATTERNS) {
    if (pattern.test(lowerText.replace(/[.!?]+$/, "").trim())) {
      return {
        isValid: false,
        reason: "META_QUERY",
        userMessage: META_QUERY_USER_MESSAGE,
      };
    }
  }

  // 6. Casual greetings filter (e.g. "hello", "hi there", "hey", "good morning", "hey what's up", "test test test")
  const rawWords = text
    .split(/[\s,.;:!?/\\(){}[\]"'`~@#$%^&*+=<>|_-]+/)
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 0);

  if (rawWords.length === 0) {
    return {
      isValid: false,
      reason: "NO_TOKENS",
      userMessage: INVALID_SITUATION_USER_MESSAGE,
    };
  }

  const nonGreetingWords = rawWords.filter((w) => {
    const letters = w.replace(/[^a-z]/g, "");
    if (!letters || letters === "s" || letters === "t" || letters === "d" || letters === "m") {
      return false; // Trailing contraction suffix from what's, it's, etc.
    }
    return (
      !CASUAL_GREETINGS.has(letters) &&
      letters !== "there" &&
      letters !== "all" &&
      letters !== "guys" &&
      letters !== "everyone"
    );
  });
  if (nonGreetingWords.length === 0) {
    return {
      isValid: false,
      reason: "CASUAL_GREETING",
      userMessage: GREETING_USER_MESSAGE,
    };
  }

  // 7. Check for repeated 2-4 character patterns (e.g. "zxczxczxc", "asdasdasd", "abababab")
  if (/(.{2,4})\1{2,}/.test(lowerLetters)) {
    return {
      isValid: false,
      reason: "REPEATED_PATTERN",
      userMessage: INVALID_SITUATION_USER_MESSAGE,
    };
  }

  // 8. Check for keyboard-smash sequences (e.g. "asdfghjkl", "qwertyuiop")
  for (const seq of KEYBOARD_SMASH_SEQUENCES) {
    if (lowerText.includes(seq)) {
      return {
        isValid: false,
        reason: "KEYBOARD_WALK",
        userMessage: INVALID_SITUATION_USER_MESSAGE,
      };
    }
  }

  // 10. Stem / Root Lexical Diversity (catches "helohello hello", "yes yes yes", "cool cool cool")
  // Checks if input consists of the same repeated root or phrase with no new semantic information
  const stems = rawWords.map((w) => normalizeTokenStem(w)).filter((s) => s.length > 0);
  const uniqueStems = new Set(stems);

  // If there are multiple words but only 1 unique stem (e.g. "helohello hello", "hello hello", "cool cool")
  if (rawWords.length >= 2 && uniqueStems.size <= 1) {
    return {
      isValid: false,
      reason: "REPEATED_STEM_NO_DIVERSITY",
      userMessage: INVALID_SITUATION_USER_MESSAGE,
    };
  }

  // 11. Gibberish word evaluation (consonant clusters & vowel deficits)
  let situationalMarkerCount = 0;
  let gibberishWordCount = 0;

  for (const word of rawWords) {
    const letters = word.replace(/[^a-z]/g, "");
    if (!letters) continue;

    // Check against situational / dilemma markers
    if (SITUATIONAL_MARKERS.has(letters) || SITUATIONAL_MARKERS.has(normalizeTokenStem(letters))) {
      situationalMarkerCount++;
      continue;
    }

    // Check vowel presence in words with length >= 3
    let hasVowel = false;
    for (const char of letters) {
      if (VOWELS.has(char)) {
        hasVowel = true;
        break;
      }
    }

    if (letters.length >= 3 && !hasVowel) {
      gibberishWordCount++;
      continue;
    }

    // Check for excessive consonant clusters (>= 5 consecutive consonants)
    if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(letters)) {
      gibberishWordCount++;
      continue;
    }

    // Check for alternating punctuation/consonant mash (e.g. "kfhgjjh;j;j;oj")
    if (letters.length >= 6) {
      let vowelCount = 0;
      for (const ch of letters) {
        if (VOWELS.has(ch)) vowelCount++;
      }
      const vowelRatio = vowelCount / letters.length;
      if (vowelRatio < 0.15) {
        gibberishWordCount++;
        continue;
      }
    }
  }

  // If there are words but all of them are flagged as consonant-heavy/vowel-less gibberish
  if (gibberishWordCount > 0 && situationalMarkerCount === 0) {
    return {
      isValid: false,
      reason: "GIBBERISH_WORDS",
      userMessage: INVALID_SITUATION_USER_MESSAGE,
    };
  }

  // 12. Short inputs situational floor requirement:
  // For short phrases (<= 4 words), require at least ONE situational/emotional/reflective marker.
  // This cleanly allows: "I'm lost", "Bad day at work", "Need advice", "Should I quit?", "help", "confused"
  // While rejecting non-situations: "pizza and burgers", "helohello hello", "apple tree", "blue car"
  if (rawWords.length <= 4 && situationalMarkerCount === 0) {
    return {
      isValid: false,
      reason: "NO_SITUATIONAL_CONTEXT",
      userMessage: INVALID_SITUATION_USER_MESSAGE,
    };
  }

  // 13. Overall vowel ratio across entire alphabetic content
  if (lowerLetters.length >= 6) {
    let totalVowels = 0;
    for (const ch of lowerLetters) {
      if (VOWELS.has(ch)) totalVowels++;
    }
    const totalVowelRatio = totalVowels / lowerLetters.length;
    if (totalVowelRatio < 0.16) {
      return {
        isValid: false,
        reason: "EXTREME_LOW_VOWEL_RATIO",
        userMessage: INVALID_SITUATION_USER_MESSAGE,
      };
    }
  }

  // 14. Lexical diversity across longer inputs
  if (rawWords.length >= 4) {
    const uniqueWords = new Set(rawWords);
    const diversityRatio = uniqueWords.size / rawWords.length;
    if (diversityRatio < 0.35) {
      return {
        isValid: false,
        reason: "LOW_LEXICAL_DIVERSITY",
        userMessage: INVALID_SITUATION_USER_MESSAGE,
      };
    }
  }

  return { isValid: true };
}
