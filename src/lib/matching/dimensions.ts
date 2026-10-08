// Dimension definitions and evaluation for PokéLife matching system

export const MATCHING_DIMENSIONS = [
  "confidence",
  "persistence",
  "adaptability",
  "courage",
  "patience",
  "calm",
] as const;

export type MatchingDimension = typeof MATCHING_DIMENSIONS[number];

export interface DimensionDefinition {
  id: MatchingDimension;
  label: string;
  shortDescription: string;
  highScoreMeaning: string; // What a score of 4 or 5 indicates
  lowScoreMeaning: string;  // What a score of 1 or 2 indicates
  representativeThemes: string[];
}

export const DIMENSION_DEFINITIONS: Record<MatchingDimension, DimensionDefinition> = {
  confidence: {
    id: "confidence",
    label: "Confidence",
    shortDescription: "Willingness to project self-assurance, take initiative, and trust one's standing.",
    highScoreMeaning: "Strong belief in one's capability, willing to assert presence, step into visibility, and act without constant external validation.",
    lowScoreMeaning: "Subtle, modest, reserved, hesitant, or needing validation/reassurance before taking the stage.",
    representativeThemes: ["Self-belief", "Initiative", "Assertiveness", "Visibility"],
  },
  persistence: {
    id: "persistence",
    label: "Persistence",
    shortDescription: "Drive to endure sustained friction, maintain grit, and continue working through headwinds.",
    highScoreMeaning: "Relentless stamina, stubborn refusal to yield, high tolerance for repetition, setbacks, and uphill struggles.",
    lowScoreMeaning: "Prefers sprint efforts, low friction paths, easily deterred by sustained slogs or seeks early alternatives.",
    representativeThemes: ["Endurance", "Grit", "Stamina", "Overcoming resistance"],
  },
  adaptability: {
    id: "adaptability",
    label: "Adaptability",
    shortDescription: "Flexibility in shifting tactics, navigating ambiguity, and transforming in response to fluid conditions.",
    highScoreMeaning: "Quick to pivot, comfortable in chaos or novel environments, multi-modal thinker, learns rapidly through experiment.",
    lowScoreMeaning: "Specialized, rigid, prefers predictability, routine, and clear linear boundaries; destabilized by sudden changes.",
    representativeThemes: ["Flexibility", "Improvisation", "Versatility", "Navigating ambiguity"],
  },
  courage: {
    id: "courage",
    label: "Courage",
    shortDescription: "Willingness to take bold risks, enter the unknown, and confront fear directly.",
    highScoreMeaning: "Eager to venture into high-stakes or intimidating terrain, confronts conflicts head-on, willing to risk failure or exposure.",
    lowScoreMeaning: "Cautious, defensive, risk-averse, highly calculates safety before moving, prefers sheltered execution.",
    representativeThemes: ["Risk-taking", "Confronting fear", "Boldness", "Pioneering"],
  },
  patience: {
    id: "patience",
    label: "Patience",
    shortDescription: "Ability to respect organic timing, delay gratification, and allow situations to ripen without forcing.",
    highScoreMeaning: "Comfortable with slow gestation, long time horizons, deep observation, and letting foundations mature before acting.",
    lowScoreMeaning: "Urgent, restless, demands immediate feedback or quick wins, prone to impatience when progress feels gradual.",
    representativeThemes: ["Long-term view", "Delayed gratification", "Maturity", "Restraint"],
  },
  calm: {
    id: "calm",
    label: "Calm",
    shortDescription: "Internal emotional equilibrium, groundedness, and resistance to panic or overwhelm.",
    highScoreMeaning: "Unshakable center, de-escalating presence, clarity under chaotic pressure, acts as an anchor.",
    lowScoreMeaning: "Reactive, volatile, emotionally sensitive, easily overstimulated or prone to anxious spirals.",
    representativeThemes: ["Equilibrium", "Composure", "Stress resilience", "Centering"],
  },
};
