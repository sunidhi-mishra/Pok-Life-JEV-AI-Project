// Builder script to merge canonical 151 data with curated product interpretations
const fs = require('fs');
const path = require('path');

const canonicalList = require('./scratch/canonical151.json');

// Curated Archetypes, Strengths, Blind Spots, and Dimension Ratings (1-5) for each of the 151 Pokémon
// Dimensions: confidence, persistence, adaptability, courage, patience, calm
const INTERPRETATIONS = {
  1: { // Bulbasaur
    archetype: "The Patient Grounder",
    strengths: ["Steady pacing", "Grounded discipline"],
    blindSpot: "Hesitant to pivot when sudden speed is required",
    dimensionRatings: { confidence: 3, persistence: 5, adaptability: 3, courage: 3, patience: 5, calm: 4 }
  },
  2: { // Ivysaur
    archetype: "The Sturdy Developer",
    strengths: ["Resilient pacing", "Quiet self-assurance"],
    blindSpot: "Can settle into comfort zones during transition stages",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 3, courage: 3, patience: 4, calm: 4 }
  },
  3: { // Venusaur
    archetype: "The Unshakable Pillar",
    strengths: ["Deep resilience", "Centering presence"],
    blindSpot: "Inflexible once rooted in a preferred direction",
    dimensionRatings: { confidence: 4, persistence: 5, adaptability: 2, courage: 4, patience: 5, calm: 5 }
  },
  4: { // Charmander
    archetype: "The Earnest Striver",
    strengths: ["Inner spark", "Willingness to try"],
    blindSpot: "Vulnerable to self-doubt if early validation flickers",
    dimensionRatings: { confidence: 2, persistence: 4, adaptability: 2, courage: 4, patience: 2, calm: 2 }
  },
  5: { // Charmeleon
    archetype: "The Restless Rebel",
    strengths: ["Fierce drive", "Competitive hunger"],
    blindSpot: "Impatience with slow or diplomatic processes",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 3, courage: 4, patience: 1, calm: 1 }
  },
  6: { // Charizard
    archetype: "The Bold Pioneer",
    strengths: ["High-stakes courage", "Magnetic presence"],
    blindSpot: "Overconfident; prone to stubborn solo charges",
    dimensionRatings: { confidence: 5, persistence: 4, adaptability: 3, courage: 5, patience: 1, calm: 2 }
  },
  7: { // Squirtle
    archetype: "The Pragmatic Coolhead",
    strengths: ["Calm composure", "Dependable team defense"],
    blindSpot: "Tends to play safe and delay vulnerable exposure",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 4, courage: 3, patience: 4, calm: 4 }
  },
  8: { // Wartortle
    archetype: "The Seasoned Navigator",
    strengths: ["Balanced defense", "Measured confidence"],
    blindSpot: "Reluctant to take uncalculated risks",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 3, courage: 3, patience: 4, calm: 4 }
  },
  9: { // Blastoise
    archetype: "The Protective Bulwark",
    strengths: ["Heavyweight reliability", "Emotional containment"],
    blindSpot: "Relies heavily on brute fortitude over nimble compromise",
    dimensionRatings: { confidence: 5, persistence: 5, adaptability: 2, courage: 4, patience: 4, calm: 5 }
  },
  10: { // Caterpie
    archetype: "The Humble Beginner",
    strengths: ["Earnest willingness", "Openness to learning"],
    blindSpot: "Easily intimidated by large challenges",
    dimensionRatings: { confidence: 1, persistence: 3, adaptability: 3, courage: 2, patience: 4, calm: 3 }
  },
  11: { // Metapod
    archetype: "The Resilient Endurer",
    strengths: ["Tough boundary-setting", "Patience under pressure"],
    blindSpot: "Complete immobility when proactive initiative is needed",
    dimensionRatings: { confidence: 2, persistence: 5, adaptability: 1, courage: 2, patience: 5, calm: 4 }
  },
  12: { // Butterfree
    archetype: "The Uplifting Transformer",
    strengths: ["Graceful transition", "Gentle perspective"],
    blindSpot: "Fragile defense when exposed to harsh conflict",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 4, courage: 3, patience: 3, calm: 4 }
  },
  13: { // Weedle
    archetype: "The Cautious Scout",
    strengths: ["Alert wariness", "Instinctive defense"],
    blindSpot: "Quick to retreat when outmatched",
    dimensionRatings: { confidence: 1, persistence: 3, adaptability: 3, courage: 2, patience: 3, calm: 3 }
  },
  14: { // Kakuna
    archetype: "The Silent Incubator",
    strengths: ["Stoic endurance", "Quiet transformation"],
    blindSpot: "Passive waiting when proactive communication is required",
    dimensionRatings: { confidence: 2, persistence: 5, adaptability: 1, courage: 2, patience: 5, calm: 4 }
  },
  15: { // Beedrill
    archetype: "The Decisive Striker",
    strengths: ["Direct action", "Uncompromising boundaries"],
    blindSpot: "Aggressive overreaction to mild friction",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 3, courage: 5, patience: 1, calm: 1 }
  },
  16: { // Pidgey
    archetype: "The Practical Commoner",
    strengths: ["Adaptable grounding", "Reliable simplicity"],
    blindSpot: "Prefers evasion over necessary direct confrontation",
    dimensionRatings: { confidence: 2, persistence: 3, adaptability: 4, courage: 2, patience: 3, calm: 4 }
  },
  17: { // Pidgeotto
    archetype: "The Vigilant Watcher",
    strengths: ["Keen awareness", "Steady loyalty"],
    blindSpot: "Territorial tension when boundaries shift",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 3, courage: 3, patience: 3, calm: 3 }
  },
  18: { // Pidgeot
    archetype: "The Noble High-Flyer",
    strengths: ["Panoramic vision", "Poised confidence"],
    blindSpot: "Distanced detachment from gritty ground-level details",
    dimensionRatings: { confidence: 5, persistence: 3, adaptability: 4, courage: 4, patience: 4, calm: 4 }
  },
  19: { // Rattata
    archetype: "The Resourceful Scrapper",
    strengths: ["Quick opportunistic action", "Tenacity in tight spots"],
    blindSpot: "Scattered focus; reactive impulsiveness",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 4, courage: 3, patience: 1, calm: 2 }
  },
  20: { // Raticate
    archetype: "The Tenacious Defender",
    strengths: ["Fierce resolve", "Tough grit"],
    blindSpot: "Combative stance when cooperative diplomacy is better",
    dimensionRatings: { confidence: 4, persistence: 5, adaptability: 3, courage: 4, patience: 1, calm: 2 }
  },
  21: { // Spearow
    archetype: "The Feisty Challenger",
    strengths: ["Instant readiness", "Refusal to back down"],
    blindSpot: "Hair-trigger temper under mild criticism",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 3, courage: 4, patience: 1, calm: 1 }
  },
  22: { // Fearow
    archetype: "The Relentless Pursuer",
    strengths: ["Stamina in flight", "Unwavering target lock"],
    blindSpot: "Tunnel vision that ignores lateral opportunities",
    dimensionRatings: { confidence: 4, persistence: 5, adaptability: 2, courage: 4, patience: 2, calm: 2 }
  },
  23: { // Ekans
    archetype: "The Subtle Infiltrator",
    strengths: ["Patient stealth", "Observant maneuvering"],
    blindSpot: "Suspicious hesitation to trust collaborators",
    dimensionRatings: { confidence: 2, persistence: 3, adaptability: 4, courage: 2, patience: 4, calm: 4 }
  },
  24: { // Arbok
    archetype: "The Intimidating Strategist",
    strengths: ["Psychological composure", "Commanding presence"],
    blindSpot: "Relies on posturing rather than genuine vulnerability",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 3, courage: 4, patience: 3, calm: 3 }
  },
  25: { // Pikachu
    archetype: "The Resilient Spark",
    strengths: ["Quick recovery", "Electric optimism", "Loyal determination"],
    blindSpot: "Prone to burnout from trying to carry too much",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 4, courage: 4, patience: 2, calm: 3 }
  },
  26: { // Raichu
    archetype: "The Grounded Dynamo",
    strengths: ["Stored power", "Balanced assertiveness"],
    blindSpot: "Holds back until pushed to extreme limits",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 3, courage: 4, patience: 3, calm: 4 }
  },
  27: { // Sandshrew
    archetype: "The Cautious Preserver",
    strengths: ["Thrift with energy", "Solid personal boundaries"],
    blindSpot: "Curling inward defensively when openness is needed",
    dimensionRatings: { confidence: 2, persistence: 4, adaptability: 2, courage: 2, patience: 4, calm: 4 }
  },
  28: { // Sandslash
    archetype: "The Rugged Self-Reliant",
    strengths: ["Autonomous problem-solving", "Tough exterior"],
    blindSpot: "Isolates themselves from supportive allies",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 3, courage: 3, patience: 3, calm: 3 }
  },
  29: { // Nidoran♀
    archetype: "The Gentle Observer",
    strengths: ["Quiet sensitivity", "Careful situational reading"],
    blindSpot: "Shy hesitation before expressing opinions",
    dimensionRatings: { confidence: 2, persistence: 3, adaptability: 3, courage: 2, patience: 4, calm: 4 }
  },
  30: { // Nidorina
    archetype: "The Nurturing Guardian",
    strengths: ["Protective loyalty", "Empathetic stability"],
    blindSpot: "Sacrifices personal boundaries for community comfort",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 3, courage: 3, patience: 4, calm: 4 }
  },
  31: { // Nidoqueen
    archetype: "The Matriarchal Shield",
    strengths: ["Fierce loyalty", "Stout grounding", "Calm authority"],
    blindSpot: "Heavy defensiveness if family/team feels questioned",
    dimensionRatings: { confidence: 5, persistence: 5, adaptability: 2, courage: 5, patience: 4, calm: 4 }
  },
  32: { // Nidoran♂
    archetype: "The Alert Sentinel",
    strengths: ["Sharp intuition", "Responsive defense"],
    blindSpot: "Easily provoked by perceived territorial challenges",
    dimensionRatings: { confidence: 2, persistence: 3, adaptability: 3, courage: 3, patience: 3, calm: 3 }
  },
  33: { // Nidorino
    archetype: "The Eager Challenger",
    strengths: ["Direct confrontation", "Energy in conflict"],
    blindSpot: "Charges ahead before assessing structural traps",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 2, courage: 4, patience: 2, calm: 2 }
  },
  34: { // Nidoking
    archetype: "The Dominant Enforcer",
    strengths: ["Uncompromising power", "Commanding drive"],
    blindSpot: "Overpowers nuanced discussions with brute demand",
    dimensionRatings: { confidence: 5, persistence: 4, adaptability: 2, courage: 5, patience: 1, calm: 2 }
  },
  35: { // Clefairy
    archetype: "The Playful Harmonizer",
    strengths: ["Gentle optimism", "Social warmth"],
    blindSpot: "Avoids tough conflict in favor of keeping light peace",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 4, courage: 2, patience: 4, calm: 4 }
  },
  36: { // Clefable
    archetype: "The Serene Mystic",
    strengths: ["Deep tranquility", "Intuitive faith"],
    blindSpot: "Detached escapism when immediate reality is messy",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 3, courage: 3, patience: 5, calm: 5 }
  },
  37: { // Vulpix
    archetype: "The Graceful Strategist",
    strengths: ["Elegance under pressure", "Clever evasion"],
    blindSpot: "Distrustful of unfamiliar surroundings",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 3, courage: 2, patience: 3, calm: 4 }
  },
  38: { // Ninetales
    archetype: "The Timeless Sage",
    strengths: ["Deep patience", "Unshakable dignified aura"],
    blindSpot: "Vindictive memory; holds long-standing grudges",
    dimensionRatings: { confidence: 5, persistence: 4, adaptability: 3, courage: 4, patience: 5, calm: 5 }
  },
  39: { // Jigglypuff
    archetype: "The Persistent Performer",
    strengths: ["Unapologetic expression", "Emotional openness"],
    blindSpot: "Easily offended when their effort goes uncelebrated",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 2, courage: 3, patience: 1, calm: 2 }
  },
  40: { // Wigglytuff
    archetype: "The Soft Cushion",
    strengths: ["Comforting presence", "Emotional resilience"],
    blindSpot: "Difficulty delivering firm or uncomfortable boundaries",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 3, courage: 3, patience: 4, calm: 4 }
  },
  41: { // Zubat
    archetype: "The Blind Explorer",
    strengths: ["Auditory navigation", "Relentless swarming persistence"],
    blindSpot: "Erratic direction without a clear anchor",
    dimensionRatings: { confidence: 2, persistence: 4, adaptability: 4, courage: 3, patience: 1, calm: 2 }
  },
  42: { // Golbat
    archetype: "The Tenacious Infiltrator",
    strengths: ["Endless pursuit", "Daring flight in darkness"],
    blindSpot: "Overextends energy pursuing low-value returns",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 3, courage: 4, patience: 2, calm: 2 }
  },
  43: { // Oddish
    archetype: "The Nighttime Thinker",
    strengths: ["Quiet nocturnal focus", "Organic timing"],
    blindSpot: "Hesitant to participate during high-visibility day hours",
    dimensionRatings: { confidence: 2, persistence: 3, adaptability: 3, courage: 2, patience: 4, calm: 4 }
  },
  44: { // Gloom
    archetype: "The Unbothered Eccentric",
    strengths: ["Total authenticity", "Radical indifference to judgment"],
    blindSpot: "Disregards interpersonal polish or collective comfort",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 3, courage: 2, patience: 4, calm: 4 }
  },
  45: { // Vileplume
    archetype: "The Blooming Sovereign",
    strengths: ["Radiant presence", "Natural self-containment"],
    blindSpot: "Toxic passive-aggression when disturbed",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 3, courage: 3, patience: 4, calm: 4 }
  },
  46: { // Paras
    archetype: "The Symbiotic Laborer",
    strengths: ["Resource extraction", "Unpretentious diligence"],
    blindSpot: "Easily dominated by parasitic demands",
    dimensionRatings: { confidence: 1, persistence: 4, adaptability: 2, courage: 2, patience: 4, calm: 3 }
  },
  47: { // Parasect
    archetype: "The Single-Minded Trance",
    strengths: ["Absolute focus", "Zero distractibility"],
    blindSpot: "Total loss of personal autonomy to single obsessions",
    dimensionRatings: { confidence: 2, persistence: 5, adaptability: 1, courage: 3, patience: 5, calm: 4 }
  },
  48: { // Venonat
    archetype: "The Sensitive Sensor",
    strengths: ["Environmental awareness", "Quiet curiosity"],
    blindSpot: "Easily disoriented by chaotic stimuli",
    dimensionRatings: { confidence: 2, persistence: 3, adaptability: 3, courage: 2, patience: 3, calm: 4 }
  },
  49: { // Venomoth
    archetype: "The Ethereal Drifter",
    strengths: ["Subtle disruption", "Graceful adaptability"],
    blindSpot: "Aloof detachment during practical execution",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 4, courage: 3, patience: 3, calm: 4 }
  },
  50: { // Diglett
    archetype: "The Hidden Worker",
    strengths: ["Rapid underground diligence", "Modesty"],
    blindSpot: "Crippling anxiety when dragged into the open light",
    dimensionRatings: { confidence: 1, persistence: 4, adaptability: 3, courage: 2, patience: 3, calm: 3 }
  },
  51: { // Dugtrio
    archetype: "The Coordinated Syndicate",
    strengths: ["Seamless teamwork", "Synchronized impact"],
    blindSpot: "Struggles with individual autonomy or solo standing",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 3, courage: 3, patience: 3, calm: 4 }
  },
  52: { // Meowth
    archetype: "The Witty Opportunist",
    strengths: ["Verbal dexterity", "Eye for hidden upside"],
    blindSpot: "Easily distracted by shiny, short-term payoffs",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 5, courage: 3, patience: 1, calm: 2 }
  },
  53: { // Persian
    archetype: "The Elegant Pragmatist",
    strengths: ["Calculated poise", "Smooth authority"],
    blindSpot: "Condescending impatience toward clumsy efforts",
    dimensionRatings: { confidence: 5, persistence: 3, adaptability: 4, courage: 4, patience: 3, calm: 4 }
  },
  54: { // Psyduck
    archetype: "The Reluctant Prodigy",
    strengths: ["Breakthroughs under acute stress", "Endearing honesty"],
    blindSpot: "Chronic self-doubt and emotional overwhelm",
    dimensionRatings: { confidence: 1, persistence: 3, adaptability: 3, courage: 2, patience: 2, calm: 1 }
  },
  55: { // Golduck
    archetype: "The Flow-State Master",
    strengths: ["Effortless focus", "Swift decisive elegance"],
    blindSpot: "Prone to arrogance when outclassing others",
    dimensionRatings: { confidence: 5, persistence: 4, adaptability: 4, courage: 4, patience: 3, calm: 4 }
  },
  56: { // Mankey
    archetype: "The Spontaneous Sparkplug",
    strengths: ["Immediate action", "Unfiltered raw passion"],
    blindSpot: "Volatile temper that burns bridges unnecessarily",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 2, courage: 5, patience: 1, calm: 1 }
  },
  57: { // Primeape
    archetype: "The Indomitable Berserker",
    strengths: ["Unstoppable adrenaline", "Tenacious follow-through"],
    blindSpot: "Blinded by fury; incapable of de-escalation",
    dimensionRatings: { confidence: 4, persistence: 5, adaptability: 2, courage: 5, patience: 1, calm: 1 }
  },
  58: { // Growlithe
    archetype: "The Loyal Guardian",
    strengths: ["Instinctive bravery", "Warm dependable heart"],
    blindSpot: "Barking at harmless shadows out of hyper-vigilance",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 3, courage: 5, patience: 3, calm: 3 }
  },
  59: { // Arcanine
    archetype: "The Majestic Champion",
    strengths: ["Noble courage", "Commanding warmth", "Steady valor"],
    blindSpot: "Overburdens themselves to meet heroic expectations",
    dimensionRatings: { confidence: 5, persistence: 5, adaptability: 3, courage: 5, patience: 3, calm: 4 }
  },
  60: { // Poliwag
    archetype: "The Sensitive Wader",
    strengths: ["Fluid evasion", "Agile learning"],
    blindSpot: "Unsure of footing on dry, demanding ground",
    dimensionRatings: { confidence: 2, persistence: 3, adaptability: 4, courage: 2, patience: 3, calm: 3 }
  },
  61: { // Poliwhirl
    archetype: "The Versatile Swimmer",
    strengths: ["Balanced coordination", "Physical adaptability"],
    blindSpot: "Jack of all trades; hesitates to specialize",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 4, courage: 3, patience: 3, calm: 4 }
  },
  62: { // Poliwrath
    archetype: "The Ironclad Swimmer",
    strengths: ["Stamina without limit", "Physical discipline"],
    blindSpot: "Attempts to muscle through problems requiring delicate tact",
    dimensionRatings: { confidence: 4, persistence: 5, adaptability: 3, courage: 4, patience: 3, calm: 3 }
  },
  63: { // Abra
    archetype: "The Strategic Retreater",
    strengths: ["Energy conservation", "Mastery of instant escape"],
    blindSpot: "Bails on challenges before learning through struggle",
    dimensionRatings: { confidence: 2, persistence: 2, adaptability: 4, courage: 1, patience: 4, calm: 5 }
  },
  64: { // Kadabra
    archetype: "The Analytical Mentalist",
    strengths: ["Sharp pattern recognition", "Mental agility"],
    blindSpot: "Overthinks straightforward physical realities",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 4, courage: 3, patience: 3, calm: 3 }
  },
  65: { // Alakazam
    archetype: "The Grand Architect",
    strengths: ["Total cognitive mastery", "Predictive clarity"],
    blindSpot: "Intellectual arrogance; dismisses emotional nuance",
    dimensionRatings: { confidence: 5, persistence: 3, adaptability: 5, courage: 3, patience: 4, calm: 4 }
  },
  66: { // Machop
    archetype: "The Dedicated Trainee",
    strengths: ["Appetite for repetition", "Humility in practice"],
    blindSpot: "Measures all worth purely through mechanical output",
    dimensionRatings: { confidence: 3, persistence: 5, adaptability: 2, courage: 4, patience: 3, calm: 3 }
  },
  67: { // Machoke
    archetype: "The Steady Heavy-Lifter",
    strengths: ["Reliable muscle", "Willingness to carry the burden"],
    blindSpot: "Reluctance to ask for assistance when strained",
    dimensionRatings: { confidence: 4, persistence: 5, adaptability: 2, courage: 4, patience: 3, calm: 3 }
  },
  68: { // Machamp
    archetype: "The Multi-Tasking Juggernaut",
    strengths: ["Simultaneous execution", "Overwhelming capacity"],
    blindSpot: "Clutters the field by trying to handle everything alone",
    dimensionRatings: { confidence: 5, persistence: 5, adaptability: 3, courage: 5, patience: 2, calm: 3 }
  },
  69: { // Bellsprout
    archetype: "The Flexible Stem",
    strengths: ["Bending without breaking", "Light-footed survival"],
    blindSpot: "Blown easily by whatever social wind is strongest",
    dimensionRatings: { confidence: 2, persistence: 3, adaptability: 5, courage: 2, patience: 3, calm: 3 }
  },
  70: { // Weepinbell
    archetype: "The Opportunistic Hook",
    strengths: ["Patience in ambush", "Grasping readiness"],
    blindSpot: "Clings possessively once an opportunity is snagged",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 3, courage: 3, patience: 4, calm: 3 }
  },
  71: { // Victreebel
    archetype: "The Voracious Devourer",
    strengths: ["Aggressive closure", "Decisive appetite"],
    blindSpot: "Consumes resources recklessly without future foresight",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 3, courage: 4, patience: 3, calm: 1 }
  },
  72: { // Tentacool
    archetype: "The Ubiquitous Drifter",
    strengths: ["Endless ocean endurance", "Discreet persistence"],
    blindSpot: "Drifts aimlessly if not constrained by currents",
    dimensionRatings: { confidence: 2, persistence: 4, adaptability: 4, courage: 2, patience: 3, calm: 3 }
  },
  73: { // Tentacruel
    archetype: "The Domain Controller",
    strengths: ["Multi-angle coordination", "Territorial poise"],
    blindSpot: "Suffocates creative freedom with excessive command",
    dimensionRatings: { confidence: 5, persistence: 4, adaptability: 3, courage: 4, patience: 3, calm: 3 }
  },
  74: { // Geodude
    archetype: "The Rugged Brawler",
    strengths: ["Rock-solid toughness", "Unpretentious stamina"],
    blindSpot: "Blunt insensitivity to delicate feelings",
    dimensionRatings: { confidence: 3, persistence: 5, adaptability: 1, courage: 4, patience: 3, calm: 3 }
  },
  75: { // Graveler
    archetype: "The Unstoppable Boulder",
    strengths: ["Momentum generation", "Downhill commitment"],
    blindSpot: "Hard to steer or stop once a roll has commenced",
    dimensionRatings: { confidence: 4, persistence: 5, adaptability: 2, courage: 4, patience: 2, calm: 2 }
  },
  76: { // Golem
    archetype: "The Armored Fortress",
    strengths: ["Unyielding impact", "Extreme pressure resistance"],
    blindSpot: "Rigid traditionalism; resists modernization",
    dimensionRatings: { confidence: 5, persistence: 5, adaptability: 1, courage: 5, patience: 4, calm: 4 }
  },
  77: { // Ponyta
    archetype: "The Spirited Galloper",
    strengths: ["Infectious momentum", "Joy in the run"],
    blindSpot: "Spooks easily if confined to tight, static spaces",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 3, courage: 3, patience: 1, calm: 2 }
  },
  78: { // Rapidash
    archetype: "The Swift Pacesetter",
    strengths: ["Competitive stride", "Effortless speed"],
    blindSpot: "Impatience with collaborators who need slower ramps",
    dimensionRatings: { confidence: 5, persistence: 4, adaptability: 3, courage: 4, patience: 1, calm: 3 }
  },
  79: { // Slowpoke
    archetype: "The Radical Unbothered",
    strengths: ["Immunity to panic", "Zero performance anxiety"],
    blindSpot: "Delayed awareness; misses critical temporal windows",
    dimensionRatings: { confidence: 2, persistence: 3, adaptability: 2, courage: 1, patience: 5, calm: 5 }
  },
  80: { // Slowbro
    archetype: "The Symbiotic Chill",
    strengths: ["Grounded nonchalance", "Unbreakable zen"],
    blindSpot: "Oblivious drift when decisive action is urgent",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 2, courage: 2, patience: 5, calm: 5 }
  },
  81: { // Magnemite
    archetype: "The Magnetic Attractor",
    strengths: ["Systematic connection", "Steady levitation"],
    blindSpot: "Overly reliant on specific external frequencies",
    dimensionRatings: { confidence: 2, persistence: 4, adaptability: 3, courage: 3, patience: 3, calm: 4 }
  },
  82: { // Magneton
    archetype: "The Triad Resonator",
    strengths: ["Harmonized synergy", "Amplified field strength"],
    blindSpot: "Generates static noise that disrupts outside peers",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 2, courage: 4, patience: 3, calm: 3 }
  },
  83: { // Farfetch'd
    archetype: "The Quirky Craftsman",
    strengths: ["Pride in small tools", "Scrappy dignity"],
    blindSpot: "Overly dogmatic about their singular weapon/method",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 3, courage: 4, patience: 3, calm: 3 }
  },
  84: { // Doduo
    archetype: "The Dual Monitor",
    strengths: ["Split-second vigilance", "Quick two-way checks"],
    blindSpot: "Internal dispute between contradictory desires",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 4, courage: 3, patience: 2, calm: 2 }
  },
  85: { // Dodrio
    archetype: "The Tri-Perspective Planner",
    strengths: ["Multi-angle scanning", "Rapid ground coverage"],
    blindSpot: "Overthinking three options simultaneously",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 4, courage: 4, patience: 1, calm: 2 }
  },
  86: { // Seel
    archetype: "The Buoyant Innocent",
    strengths: ["Comfort in freezing waters", "Pure playful spirit"],
    blindSpot: "Naive unreadiness for cynical interpersonal games",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 3, courage: 2, patience: 4, calm: 4 }
  },
  87: { // Dewgong
    archetype: "The Elegant Glider",
    strengths: ["Graceful poise", "Thermal insulation against stress"],
    blindSpot: "Passivity in warm, contentious environments",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 3, courage: 3, patience: 5, calm: 5 }
  },
  88: { // Grimer
    archetype: "The Resilient Sludge",
    strengths: ["Thriving in toxic waste", "Malleable consistency"],
    blindSpot: "Leaves messy aftermaths in clean spaces",
    dimensionRatings: { confidence: 2, persistence: 4, adaptability: 5, courage: 2, patience: 3, calm: 3 }
  },
  89: { // Muk
    archetype: "The Unapologetic Behemoth",
    strengths: ["Total absorption of negativity", "Heavy ground presence"],
    blindSpot: "Suffocating clinginess; hard to cleanse boundary lines",
    dimensionRatings: { confidence: 4, persistence: 5, adaptability: 4, courage: 3, patience: 3, calm: 3 }
  },
  90: { // Shellder
    archetype: "The Hard Clam",
    strengths: ["Impenetrable shell", "Patience in waiting for safety"],
    blindSpot: "Total shut-down whenever vulnerability is invited",
    dimensionRatings: { confidence: 2, persistence: 4, adaptability: 2, courage: 1, patience: 5, calm: 4 }
  },
  91: { // Cloyster
    archetype: "The Fortified Sentry",
    strengths: ["Spike-sharp defense", "Diamond-hard security"],
    blindSpot: "Guards against threats that no longer exist",
    dimensionRatings: { confidence: 4, persistence: 5, adaptability: 2, courage: 3, patience: 5, calm: 4 }
  },
  92: { // Gastly
    archetype: "The Ethereal Tease",
    strengths: ["Bypassing material blocks", "Playful irreverence"],
    blindSpot: "Lack of physical follow-through; vaporizes under discipline",
    dimensionRatings: { confidence: 3, persistence: 2, adaptability: 5, courage: 3, patience: 2, calm: 4 }
  },
  93: { // Haunter
    archetype: "The Mischievous Catalyst",
    strengths: ["Disrupting stiff routines", "Levity in dark corners"],
    blindSpot: "Pushes pranks past the edge of respectful comfort",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 5, courage: 4, patience: 2, calm: 3 }
  },
  94: { // Gengar
    archetype: "The Shadow Maestro",
    strengths: ["Total comfort in the dark", "Audacious charisma"],
    blindSpot: "Cynical mockery when sincere vulnerability is required",
    dimensionRatings: { confidence: 5, persistence: 3, adaptability: 5, courage: 5, patience: 3, calm: 3 }
  },
  95: { // Onix
    archetype: "The Subterranean Colossus",
    strengths: ["Monumental scale", "Quiet deep-earth stability"],
    blindSpot: "Cumbersome clumsiness in tight, agile negotiations",
    dimensionRatings: { confidence: 4, persistence: 5, adaptability: 1, courage: 4, patience: 4, calm: 4 }
  },
  96: { // Drowzee
    archetype: "The Dream Reader",
    strengths: ["Deep intuitive hypnosis", "Subconscious listening"],
    blindSpot: "Somnolent grogginess during active waking emergencies",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 3, courage: 2, patience: 4, calm: 4 }
  },
  97: { // Hypno
    archetype: "The Trance Commander",
    strengths: ["Laser hypnotic focus", "Measured rhythmic pacing"],
    blindSpot: "Eerie detachment; unsettling to transparent peers",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 3, courage: 3, patience: 5, calm: 4 }
  },
  98: { // Krabby
    archetype: "The Scrappy Sidestepper",
    strengths: ["Punchy self-defense", "Sideways problem navigation"],
    blindSpot: "Snaps instinctively before evaluating if a pinch is warranted",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 3, courage: 3, patience: 2, calm: 2 }
  },
  99: { // Kingler
    archetype: "The Heavy Claw",
    strengths: ["Crushing leverage", "Imposing boundary defense"],
    blindSpot: "Unbalanced; one heavy asset can throw off full equilibrium",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 2, courage: 4, patience: 3, calm: 3 }
  },
  100: { // Voltorb
    archetype: "The Hair-Trigger Fuse",
    strengths: ["Immediate detonation of stuck deadlocks", "High voltage"],
    blindSpot: "Explodes destructively at the slightest inconvenience",
    dimensionRatings: { confidence: 3, persistence: 2, adaptability: 2, courage: 5, patience: 1, calm: 1 }
  },
  101: { // Electrode
    archetype: "The Rolling Dynamo",
    strengths: ["Terrifying velocity", "Willingness to reset the board"],
    blindSpot: "Scorched-earth solutions when gradual repair was viable",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 3, courage: 5, patience: 1, calm: 1 }
  },
  102: { // Exeggcute
    archetype: "The Distributed Cluster",
    strengths: ["Shared risk", "Collective consensus"],
    blindSpot: "Easily cracked if separated from the peer group",
    dimensionRatings: { confidence: 2, persistence: 3, adaptability: 4, courage: 2, patience: 4, calm: 3 }
  },
  103: { // Exeggutor
    archetype: "The Jolly Multitude",
    strengths: ["Sunny optimism", "Broad cognitive span"],
    blindSpot: "Internal cacophony when heads disagree on direction",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 4, courage: 3, patience: 3, calm: 4 }
  },
  104: { // Cubone
    archetype: "The Lonely Mourner",
    strengths: ["Deep emotional depth", "Courage born of hardship"],
    blindSpot: "Wears armor of past grief; guards against present joy",
    dimensionRatings: { confidence: 2, persistence: 4, adaptability: 2, courage: 4, patience: 3, calm: 2 }
  },
  105: { // Marowak
    archetype: "The Hardened Survivor",
    strengths: ["Bone-deep resolve", "Transmuted pain into discipline"],
    blindSpot: "Hyper-independent; assumes the world is hostile",
    dimensionRatings: { confidence: 4, persistence: 5, adaptability: 2, courage: 5, patience: 3, calm: 3 }
  },
  106: { // Hitmonlee
    archetype: "The Precision Striker",
    strengths: ["Elastic reach", "Decisive targeted impact"],
    blindSpot: "One-dimensional focus on kinetic pushback",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 3, courage: 5, patience: 2, calm: 3 }
  },
  107: { // Hitmonchan
    archetype: "The Disciplined Pugilist",
    strengths: ["Rhythmic boxing cadence", "Iron stamina in rounds"],
    blindSpot: "Rigid reliance on clean sparring rules in messy street fights",
    dimensionRatings: { confidence: 4, persistence: 5, adaptability: 3, courage: 4, patience: 3, calm: 3 }
  },
  108: { // Lickitung
    archetype: "The Tactile Explorer",
    strengths: ["Experiential learning", "Unfiltered sensory curiosity"],
    blindSpot: "Zero sense of social distance or hygiene",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 4, courage: 3, patience: 3, calm: 4 }
  },
  109: { // Koffing
    archetype: "The Buoyant Smiler",
    strengths: ["Smiling through pollution", "Lighthearted buoyancy"],
    blindSpot: "Emits toxic fumes unconsciously into shared air",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 4, courage: 2, patience: 3, calm: 4 }
  },
  110: { // Weezing
    archetype: "The Dual-Chamber Converter",
    strengths: ["Neutralizing foul atmospheres", "Mutual support"],
    blindSpot: "Internalized self-deprecation due to unsavory tasks",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 3, courage: 3, patience: 3, calm: 3 }
  },
  111: { // Rhyhorn
    archetype: "The Straight-Line Charger",
    strengths: ["Unstoppable brute momentum", "Zero hesitation"],
    blindSpot: "Cannot turn corners; forgets why it started running",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 1, courage: 4, patience: 1, calm: 2 }
  },
  112: { // Rhydon
    archetype: "The Drill Master",
    strengths: ["Boring through bedrock", "Stout physical presence"],
    blindSpot: "Solves fine clockwork dilemmas with heavy sledgehammers",
    dimensionRatings: { confidence: 5, persistence: 5, adaptability: 1, courage: 5, patience: 2, calm: 3 }
  },
  113: { // Chansey
    archetype: "The Unconditional Caregiver",
    strengths: ["Endless emotional reservoir", "Nutrient sharing"],
    blindSpot: "Chronic people-pleasing; ignores own acute wounds",
    dimensionRatings: { confidence: 3, persistence: 5, adaptability: 3, courage: 3, patience: 5, calm: 5 }
  },
  114: { // Tangela
    archetype: "The Enigmatic Vine",
    strengths: ["Regenerative wrapping", "Intriguing mystery"],
    blindSpot: "Entangles itself in over-complicated knots",
    dimensionRatings: { confidence: 2, persistence: 4, adaptability: 4, courage: 2, patience: 4, calm: 4 }
  },
  115: { // Kangaskhan
    archetype: "The Fierce Protector",
    strengths: ["Unyielding parental bravery", "Sheltering warmth"],
    blindSpot: "Overprotective aggression toward benign strangers",
    dimensionRatings: { confidence: 5, persistence: 5, adaptability: 2, courage: 5, patience: 4, calm: 3 }
  },
  116: { // Horsea
    archetype: "The Delicate Marksman",
    strengths: ["Ink-screen defense", "Accurate subtle shots"],
    blindSpot: "Vulnerable to sudden swift cross-currents",
    dimensionRatings: { confidence: 2, persistence: 3, adaptability: 3, courage: 2, patience: 4, calm: 3 }
  },
  117: { // Seadra
    archetype: "The Bristling Guardian",
    strengths: ["Spiny boundary enforcement", "Agile whirlpool tactics"],
    blindSpot: "Prickly defensiveness even when approached kindly",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 3, courage: 4, patience: 3, calm: 3 }
  },
  118: { // Goldeen
    archetype: "The Graceful Swimmer",
    strengths: ["Elegance in motion", "Instinctive defense"],
    blindSpot: "Demands pristine aesthetic conditions to thrive",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 3, courage: 3, patience: 3, calm: 3 }
  },
  119: { // Seaking
    archetype: "The Upstream Champion",
    strengths: ["Powerful counter-current swimming", "Nest protection"],
    blindSpot: "Stubborn upstream battles when easier channels exist",
    dimensionRatings: { confidence: 4, persistence: 5, adaptability: 2, courage: 4, patience: 3, calm: 3 }
  },
  120: { // Staryu
    archetype: "The Resilient Core",
    strengths: ["Infinite tissue regeneration", "Quiet jewel focus"],
    blindSpot: "Impassive; gives minimal emotional feedback",
    dimensionRatings: { confidence: 3, persistence: 5, adaptability: 4, courage: 3, patience: 4, calm: 5 }
  },
  121: { // Starmie
    archetype: "The Enigmatic Core",
    strengths: ["Crystalline balance", "Radiant multi-element versatility"],
    blindSpot: "Aloof geometry; alienates grounded earthy peers",
    dimensionRatings: { confidence: 5, persistence: 4, adaptability: 5, courage: 4, patience: 4, calm: 5 }
  },
  122: { // Mr. Mime
    archetype: "The Boundary Architect",
    strengths: ["Invisible wall construction", "Theatrical framing"],
    blindSpot: "Replaces genuine conversation with pantomimed barriers",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 4, courage: 3, patience: 3, calm: 4 }
  },
  123: { // Scyther
    archetype: "The Razor Precisionist",
    strengths: ["Blinding speed", "Surgical decisive strikes"],
    blindSpot: "Brittle patience; hates prolonged diplomatic negotiations",
    dimensionRatings: { confidence: 5, persistence: 3, adaptability: 4, courage: 5, patience: 1, calm: 2 }
  },
  124: { // Jynx
    archetype: "The Rhythmic Communicator",
    strengths: ["Mesmerizing sway", "Soulful sound connection"],
    blindSpot: "Misunderstood eccentricities spark polarization",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 3, courage: 3, patience: 3, calm: 3 }
  },
  125: { // Electabuzz
    archetype: "The High-Voltage Igniter",
    strengths: ["Explosive dynamic energy", "Electric readiness"],
    blindSpot: "Overloads circuits; creates chaotic brownouts",
    dimensionRatings: { confidence: 5, persistence: 3, adaptability: 3, courage: 5, patience: 1, calm: 1 }
  },
  126: { // Magmar
    archetype: "The Molten Forge",
    strengths: ["Transformative internal heat", "Fiery presence"],
    blindSpot: "Scorches surroundings; lacks cooling mechanisms",
    dimensionRatings: { confidence: 5, persistence: 4, adaptability: 2, courage: 5, patience: 1, calm: 1 }
  },
  127: { // Pinsir
    archetype: "The Relentless Clamper",
    strengths: ["Grip of iron", "No-nonsense physical resolve"],
    blindSpot: "Freezes in bitter cold; helpless against airborne change",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 2, courage: 4, patience: 2, calm: 2 }
  },
  128: { // Tauros
    archetype: "The Stampeding Force",
    strengths: ["Unbridled momentum", "Wild visceral energy"],
    blindSpot: "Self-whipping frenzy; easily baited by red flags",
    dimensionRatings: { confidence: 5, persistence: 4, adaptability: 2, courage: 5, patience: 1, calm: 1 }
  },
  129: { // Magikarp
    archetype: "The Unseen Potential",
    strengths: ["Surviving utter dismissal", "Relentless harmless splashing"],
    blindSpot: "Feels powerlessly ineffective in current baseline form",
    dimensionRatings: { confidence: 1, persistence: 5, adaptability: 2, courage: 2, patience: 4, calm: 2 }
  },
  130: { // Gyarados
    archetype: "The Tempestuous Ascendant",
    strengths: ["Total metamorphosis", "Overpowering tidal might"],
    blindSpot: "Destructive retribution for past grievances",
    dimensionRatings: { confidence: 5, persistence: 4, adaptability: 2, courage: 5, patience: 1, calm: 1 }
  },
  131: { // Lapras
    archetype: "The Gentle Ferryman",
    strengths: ["Compassionate transport", "Calm in deep waters", "Melodic serenity"],
    blindSpot: "Too trusting; susceptible to exploitation by predatory peers",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 3, courage: 4, patience: 5, calm: 5 }
  },
  132: { // Ditto
    archetype: "The Ultimate Chameleon",
    strengths: ["Total structural mirroring", "Ego-less fluidity"],
    blindSpot: "Lacks internal core; forgets own authentic identity",
    dimensionRatings: { confidence: 2, persistence: 3, adaptability: 5, courage: 2, patience: 4, calm: 4 }
  },
  133: { // Eevee
    archetype: "The Unwritten Canvas",
    strengths: ["Infinite evolution options", "Cheerful adaptability", "Open-hearted learning"],
    blindSpot: "Decision paralysis from having too many open futures",
    dimensionRatings: { confidence: 3, persistence: 3, adaptability: 5, courage: 3, patience: 3, calm: 3 }
  },
  134: { // Vaporeon
    archetype: "The Fluid Dissolver",
    strengths: ["Melting into water", "Seamless adaptation to mood"],
    blindSpot: "Loses distinct form when pressure becomes acute",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 5, courage: 3, patience: 4, calm: 5 }
  },
  135: { // Jolteon
    archetype: "The Lightning Reflex",
    strengths: ["Split-second decisions", "High-velocity electric spark"],
    blindSpot: "Nervous hypersensitivity; quick to startle",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 4, courage: 4, patience: 1, calm: 2 }
  },
  136: { // Flareon
    archetype: "The Warm Hearth",
    strengths: ["Intense personal warmth", "Stored thermal passion"],
    blindSpot: "Overheats quickly; needs extended downtime between bursts",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 3, courage: 4, patience: 2, calm: 3 }
  },
  137: { // Porygon
    archetype: "The Digital Pioneer",
    strengths: ["Flawless code-level logic", "Frictionless simulation"],
    blindSpot: "Bewildered by messy organic human emotions",
    dimensionRatings: { confidence: 3, persistence: 4, adaptability: 4, courage: 2, patience: 4, calm: 5 }
  },
  138: { // Omanyte
    archetype: "The Ancient Spiral",
    strengths: ["Prehistoric endurance", "Patient shell defense"],
    blindSpot: "Slow to awaken to fast modern real-time dynamics",
    dimensionRatings: { confidence: 2, persistence: 4, adaptability: 2, courage: 2, patience: 5, calm: 4 }
  },
  139: { // Omastar
    archetype: "The Armored Grasper",
    strengths: ["Crushing beak", "Relentless spiral protection"],
    blindSpot: "Weighed down by its own over-developed armor",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 2, courage: 3, patience: 4, calm: 4 }
  },
  140: { // Kabuto
    archetype: "The Timeless Carapace",
    strengths: ["Undisturbed survival across eras", "Stout dome"],
    blindSpot: "Paralyzed if turned upside down",
    dimensionRatings: { confidence: 2, persistence: 5, adaptability: 2, courage: 2, patience: 5, calm: 4 }
  },
  141: { // Kabutops
    archetype: "The Ancient Reaper",
    strengths: ["Sleek aquatic hunting", "Swift scythe precision"],
    blindSpot: "Specialized for a primeval sea that no longer exists",
    dimensionRatings: { confidence: 5, persistence: 4, adaptability: 3, courage: 4, patience: 3, calm: 3 }
  },
  142: { // Aerodactyl
    archetype: "The Primordial Screamer",
    strengths: ["Uncompromising sky dominance", "Raw feral courage"],
    blindSpot: "Intolerant of confinement or patient diplomacy",
    dimensionRatings: { confidence: 5, persistence: 3, adaptability: 2, courage: 5, patience: 1, calm: 1 }
  },
  143: { // Snorlax
    archetype: "The Serene Anchor",
    strengths: ["Unshakable peace", "Immense digestion of stress", "Restorative naps"],
    blindSpot: "Massive inertia; extremely difficult to awaken to action",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 1, courage: 2, patience: 5, calm: 5 }
  },
  144: { // Articuno
    archetype: "The Winter Beacon",
    strengths: ["Sublime grace", "Cooling feverish minds", "Legendary poise"],
    blindSpot: "Chilling emotional detachment; aloof distance",
    dimensionRatings: { confidence: 5, persistence: 4, adaptability: 3, courage: 4, patience: 4, calm: 5 }
  },
  145: { // Zapdos
    archetype: "The Tempestuous Spark",
    strengths: ["Electrifying momentum", "Breakthrough velocity", "Commanding sky presence"],
    blindSpot: "Stormy unpredictability; leaves crackling tension behind",
    dimensionRatings: { confidence: 5, persistence: 4, adaptability: 3, courage: 5, patience: 1, calm: 2 }
  },
  146: { // Moltres
    archetype: "The Immortal Flame",
    strengths: ["Rebirth through trial", "Illuminating courage", "Radiant renewal"],
    blindSpot: "Consumes fuel furiously; scorched earth during transitions",
    dimensionRatings: { confidence: 5, persistence: 5, adaptability: 2, courage: 5, patience: 2, calm: 3 }
  },
  147: { // Dratini
    archetype: "The Mystic Seeder",
    strengths: ["Sacred patience", "Purity of untainted potential"],
    blindSpot: "Vulnerable to sudden storms before shedding its skin",
    dimensionRatings: { confidence: 2, persistence: 4, adaptability: 3, courage: 2, patience: 5, calm: 4 }
  },
  148: { // Dragonair
    archetype: "The Serene Aura",
    strengths: ["Weather-harmonizing presence", "Poised quiet majesty"],
    blindSpot: "Prefers mystical sanctuary over practical conflicts",
    dimensionRatings: { confidence: 4, persistence: 4, adaptability: 4, courage: 3, patience: 5, calm: 5 }
  },
  149: { // Dragonite
    archetype: "The Benevolent Titan",
    strengths: ["Heart of gold", "Crossing oceans to rescue others", "Vast capable strength"],
    blindSpot: "Heartbroken and prone to catastrophic fury if betrayed",
    dimensionRatings: { confidence: 5, persistence: 5, adaptability: 4, courage: 5, patience: 4, calm: 4 }
  },
  150: { // Mewtwo
    archetype: "The Existential Sovereign",
    strengths: ["Fierce autonomy", "Intellectual depth", "Unflinching search for purpose"],
    blindSpot: "Severe defensive cynicism and trust barriers",
    dimensionRatings: { confidence: 5, persistence: 4, adaptability: 4, courage: 5, patience: 3, calm: 3 }
  },
  151: { // Mew
    archetype: "The Primordial Spark",
    strengths: ["Boundless curiosity", "Universal empathy", "Joyful spontaneous mastery"],
    blindSpot: "Disappears like a mirage when heavy burdens appear",
    dimensionRatings: { confidence: 4, persistence: 3, adaptability: 5, courage: 4, patience: 4, calm: 5 }
  }
};

function buildDataset() {
  console.log("Merging canonical data with product interpretations for 151 Pokémon...");
  const fullRecords = canonicalList.map(canon => {
    const interp = INTERPRETATIONS[canon.id];
    if (!interp) {
      throw new Error(`Missing interpretation for Pokémon ID ${canon.id} (${canon.name})`);
    }

    return {
      id: canon.id,
      name: canon.name,
      canonical: canon.canonical,
      productInterpretation: interp
    };
  });

  const outDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'pokemon151.json');
  fs.writeFileSync(outPath, JSON.stringify(fullRecords, null, 2), 'utf-8');
  console.log(`Successfully compiled 151 Pokémon into ${outPath}`);
}

buildDataset();
