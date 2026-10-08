# 🔴 PokéLife ⚡

### 🎮 What if your next life dilemma came with a Pokémon companion? 🌿

[![Live Demo](https://img.shields.io/badge/🌐%20LIVE%20DEMO-pokelife--jev--ai--project.netlify.app-E24236?style=for-the-badge&logo=netlify&logoColor=white)](https://pokelife-jev-ai-project.netlify.app/)
&nbsp;
[![Try PokéLife](https://img.shields.io/badge/⚡%20LAUNCH%20APP-Click%20Here-18243C?style=for-the-badge&logo=pokemon&logoColor=yellow)](https://pokelife-jev-ai-project.netlify.app/)

PokéLife is a playful AI-powered self-reflection experience that turns a real-life situation into a Pokémon companion matched to the moment. 🎯

Instead of asking **"Which Pokémon are you?"**, PokéLife asks:

> **"Which Pokémon fits what you're dealing with right now?"** 🧭

The experience combines two contrasting perspectives from Ash 🧢 and Misty 💧 with a structured AI decision layer to recommend one of the original 151 Pokémon. 🐾

---

## 💡 Why I Built This

Most AI experiences rely on a single LLM to interpret a user's input, make a decision, and generate the final response.

PokéLife deliberately takes a different approach.

The product separates:

- **Language understanding** 🗣️ → Groq
- **Deterministic constraints and matching** 📐 → Application code
- **Structured decision-making** 🧠 → JEV
- **Natural-language explanation** 💬 → Groq

The goal was to explore a practical AI product question:

> **When should a product use an LLM, when should it use deterministic software, and when is a structured decision model more appropriate?** 🔍

---

## ⚙️ How It Works

```text
User describes a situation 📝
          ↓
     Quality Gate 🛡️
          ↓
       Groq #1 ⚡
   Understand situation
          ↓
 Structured situation
 + 6 dimension needs 📊
          ↓
 Deterministic Matcher 🎯
          ↓
 Top 5 Pokémon candidates 📋
          ↓
       JEV · Choice 🧠
 Select one candidate
          ↓
      Groq #2 💬
 Generate explanation
          ↓
 Ash + Misty + Why 👥
          ↓
      Final Result 🏆
```

### 📊 The Six Matching Dimensions

PokéLife represents a situation using six product-defined dimensions:
- 🔥 **Confidence**
- 🛡️ **Persistence**
- 🌊 **Adaptability**
- ⚡ **Courage**
- ⏳ **Patience**
- 🧘 **Calm**

These represent situational needs, not a psychological profile of the user.

---

### 🤔 Why Not Just Use One LLM?

Because different parts of the problem have different requirements.

| Problem | Approach | Why |
| :--- | :--- | :--- |
| **Understand the user's situation** | 🗣️ Groq | Natural language requires interpretation |
| **Reject obvious garbage** | 🛡️ Deterministic code | No AI inference is necessary |
| **Filter Pokémon candidates** | 📐 Deterministic matcher | Hard constraints should remain predictable |
| **Select the best candidate** | 🧠 JEV | Structured judgment over a constrained choice set |
| **Explain the result** | 💬 Groq | Natural language generation is appropriate |

This creates a simple principle:
> **Use AI where ambiguity exists. Use rules where certainty matters.** ✨

---

### 🛡️ Input Quality Gate

Before any external AI call, PokéLife runs a deterministic local input-quality gate. This prevents obvious garbage or irrelevant inputs from consuming AI credits. 💳🚫

The gate checks for signals including:
- 📏 Extremely short input
- 🔤 Insufficient alphabetic content
- 🔢 Symbol/numeric-dominated input
- 🔁 Excessive character repetition
- 🤖 Standalone meta queries
- 👋 Standalone greetings
- 🧩 Repeated substrings
- ⌨️ Keyboard-smash patterns
- 📚 Low lexical diversity
- 🔀 Gibberish-like consonant/vowel patterns
- 💭 Non-situational short inputs

#### ❌ Rejected locally:
- `asdfghjkl`
- `123456789`
- `aaaaaaaaaaaa`
- `qwertyuiop`
- `who are you?`
- `hello`

#### ✅ Allowed through pipeline:
- *I'm lost*
- *I'm stuck*
- *Should I quit?*
- *I'm nervous about moving*
- *Bad day at work*

#### 🎯 Why this matters
The Quality Gate is intentionally deterministic. There is no reason to spend an LLM call deciding whether `asdfghjkl` is a meaningful life situation. The gate acts as a cheap preflight layer before the more expensive AI pipeline.

---

### 🐾 Pokémon Matching

PokéLife uses the original 151 Pokémon as the companion pool. Each Pokémon has a product-defined archetype and six dimension ratings.

| Pokémon | Archetype | Example Strengths |
| :--- | :--- | :--- |
| **Bulbasaur** 🍃 | The Patient Grounder | Persistence, Patience |
| **Pikachu** ⚡ | The Resilient Spark | Confidence, Adaptability, Courage |
| **Snorlax** 💤 | The Serene Anchor | Patience, Calm |

These are product archetypes, not objective personality or psychological classifications.

The Pokémon dataset is bundled locally, so the application does not need to call PokéAPI at runtime. 📦

---

### 🎯 Deterministic Matching

The first matching stage calculates similarity between the situation's needs and each Pokémon's six-dimensional profile.

The matcher:
1. 📥 Receives six situational need weights.
2. 🧮 Scores all 151 Pokémon deterministically.
3. 🏅 Selects the top candidates.
4. ⚖️ Applies deterministic tie-breaking.
5. 📤 Sends only the top 5 candidates to JEV.

The application therefore does not send all 151 Pokémon to JEV. This keeps the structured decision step constrained and predictable.

---

### 🧠 JEV Decision Layer

JEV is used for the final structured choice among the shortlisted Pokémon. The current implementation uses JEV's Choice capability:

```text
Situation 📝
    ↓
Deterministic Top 5 📋
    ↓
JEV Choice 🧠
    ↓
One Pokémon 🌟
```

JEV does not generate the final user-facing explanation. Its responsibility is narrower:
> **Choose one Pokémon from a constrained candidate set.**

The application validates that the returned Pokémon actually belongs to the shortlist. If JEV returns an invalid candidate, the pipeline rejects the result rather than silently selecting another Pokémon. 🔒

---

### 👥 Ash + Misty Perspectives

The final explanation uses two deliberately different perspectives:

- 🧢 **Ash**: Optimistic, action-oriented, growth-focused.
- 💧 **Misty**: Practical, skeptical, risk-aware, emotionally aware.

They are not separate autonomous agents having a long conversation. They are short product perspectives designed to give the user two different ways of looking at the same situation.

---

## ⚠️ Product Boundaries

PokéLife is intentionally designed as an entertainment and self-reflection experience. It is **not**:

- 🏥 Therapy
- 🩺 Mental-health diagnosis
- 💼 Professional advice
- 📋 A psychological assessment
- 🏛️ A serious decision-making system
- 🤝 A replacement for human judgment

The Pokémon recommendation is a playful interpretation of the situation, not a factual assessment of the user.

---

## 🛠️ Tech Stack

- 🖥️ **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- ⚡ **AI Engine**: Groq Cloud (`openai/gpt-oss-120b`), OpenRouter (`typesafe/jev-1.13`)
- 📦 **Data**: Bundled original 151 Pokémon dataset with local product archetypes
- 🧪 **Validation & Testing**: Node test runner (`node:test`), TypeScript strict checking, deterministic quality gate suite
- ☁️ **Deployment**: Netlify

---

## 🏗️ Architecture

```text
┌───────────────────────┐
│        User 👤        │
│  Real-life situation  │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│   Deterministic 🛡️    │
│    Quality Gate       │
│                       │
│ Reject obvious        │
│ garbage locally       │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│       Groq #1 ⚡      │
│                       │
│ Situation             │
│ Understanding         │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ Deterministic 🎯      │
│ Matching Engine       │
│                       │
│ 151 → Top 5           │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│       JEV 🧠          │
│                       │
│ Structured Choice     │
│ Top 5 → 1             │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│       Groq #2 💬      │
│                       │
│ Ash + Misty +         │
│ Pokémon explanation   │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│      PokéLife 🏆      │
│      Result           │
└───────────────────────┘
```

---

## 📌 Key Product Decisions

1. 🚫 **JEV does not see all 151 Pokémon**  
   The deterministic matcher first reduces the candidate space to five. The application knows the hard constraint: the selected Pokémon must come from the candidate set. JEV is then used where structured judgment adds value rather than asking it to perform the entire matching problem.

2. 🔒 **The LLM does not control the final Pokémon**  
   Groq interprets the situation and generates the explanation. It does not get to arbitrarily override the structured Pokémon selection. This keeps the recommendation constrained by application logic.

3. ⚡ **No database in the MVP**  
   The product does not require user accounts, persistent profiles, vector databases, or complex agent frameworks. The core loop operates cleanly and with lower latency without them.

4. 🔴 **Original 151 only**  
   The MVP intentionally limits the companion pool to the original 151 Pokémon. This creates a bounded, understandable product system instead of turning the experience into an unstructured Pokémon encyclopedia.

---

## 🧪 Testing & Quality Assurance

The project includes 103 automated tests across 18 suites:
- ✅ Pokémon dataset validation (151 records, full IDs, canonical types, dimension ratings)
- ✅ Deterministic matching & Top-K candidate selection
- ✅ Boundary checking & tie-breaking determinism
- ✅ Input validation & Quality Gate behavior
- ✅ AI adapter contracts & schema validation
- ✅ API orchestration & pipeline integration
- ✅ JEV shortlist enforcement & out-of-bounds rejection
- ✅ Provider failure handling & mock-mode safety

```bash
npm run test
```

```text
✔ PokéLife Deterministic Matcher & Scoring Suite
✔ PokéLife Match API Pipeline Orchestration Suite
✔ Deterministic Input Quality Gate Suite

ℹ tests 103
ℹ suites 18
ℹ pass 103
ℹ fail 0
```

---

## 🚀 Running Locally

### 1. 📥 Clone the repository
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd PokéLife-JEV-AI-Project
```

### 2. 📦 Install dependencies
```bash
npm install
```

### 3. 🔑 Configure environment variables
Create a `.env.local` file:
```env
# Groq Cloud API Key
GROQ_API_KEY="your_groq_api_key"
GROQ_MODEL="openai/gpt-oss-120b"

# OpenRouter API Key for JEV Decisions API
OPENROUTER_API_KEY="your_openrouter_api_key"
JEV_MODEL="typesafe/jev-1.13"

# Explicit mock mode toggle (false = live providers, true = mock)
AI_MOCK_MODE=false
```

*(Never commit `.env.local`)*

### 4. 💻 Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🌐

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── about/             # 📖 "About" product philosophy page
│   ├── creatures/         # 🐾 "The Creatures" 151 exploration page
│   ├── how-it-works/      # ⚙️ "How It Works" architecture breakdown
│   ├── api/
│   │   └── match/         # ⚡ Serverless /api/match POST handler
│   ├── layout.tsx         # 🎨 Root layout with retro typography
│   └── page.tsx           # 🏠 Home companion-matching interactive page
│
├── components/
│   ├── Header.tsx         # 🧭 Navigation header
│   ├── InputPanel.tsx     # 📝 Step 1 situation input with live examples
│   ├── ResultPanel.tsx    # 🏆 Step 2/3 match display with Ash & Misty
│   └── ShareModal.tsx     # 🎴 Retro RPG result card & native sharing modal
│
├── data/
│   ├── pokemon151.json    # 📚 Complete 151 Pokémon product dataset
│   └── validatePokemon.js # 🔍 Dataset integrity validator
│
├── lib/
│   ├── ai/
│   │   ├── grok.ts        # ⚡ Groq client (natural language interpretation)
│   │   └── jev.ts         # 🧠 JEV client (structured choice decision)
│   │
│   ├── matching/
│   │   ├── dimensions.ts  # 📊 Six situational dimensions
│   │   └── filter.ts      # 🎯 Deterministic 151 scoring & Top-5 shortlist
│   │
│   ├── orchestration/
│   │   └── orchestrator.ts# 🔄 Pipeline coordinator & stage management
│   │
│   └── validation/
│       ├── aiSchemas.ts   # 📋 Structured output validation
│       ├── apiInput.ts    # 🛡️ /api/match request validation
│       └── qualityGate.ts # 🚨 Deterministic input quality gate
│
└── types/
    ├── ai.ts
    ├── api.ts
    └── pokemon.ts
```

---

## 🔮 What I Would Build Next

The current MVP deliberately focuses on the core loop:  
**Situation → Interpretation → Decision → Explanation** 🔄

Potential next improvements would focus on product value rather than simply adding more AI:
- 📈 Improve the input-quality evaluation using real user feedback
- 📊 Measure which Pokémon recommendations users actually find useful
- ⚡ Improve latency across the multi-stage AI pipeline
- 🎴 Add richer result sharing options
- 🕰️ Explore lightweight result history
- 🔁 Evaluate whether users return for multiple situations
- 🎭 Test whether Ash/Misty perspectives improve perceived usefulness
- 🎨 Refine Pokémon archetypes based on observed matching quality

---

## 🌟 What This Project Demonstrates

PokéLife is intentionally focused in scope, exploring several practical AI product engineering concepts:
- 🎯 **Designing an AI product around a clear user experience**
- ⚖️ **Separating deterministic logic from probabilistic AI**
- 🧠 **Using structured AI decisions instead of free-form generation**
- 📉 **Constraining model inputs to reduce unnecessary inference**
- 🛡️ **Protecting AI credits with deterministic validation**
- 📜 **Designing typed contracts between application code and AI providers**
- 🚨 **Handling provider failures explicitly**
- 🚀 **Building and deploying an AI-enabled product end-to-end**

---

## 💻 Built With

**Next.js** ⚛️ · **TypeScript** 🟦 · **Groq** ⚡ · **OpenRouter** 🔌 · **TypeSafe JEV** 🧠 · **Netlify** 🌐

---

## 📜 Disclaimer

PokéLife is a fictional, entertainment-focused experience. Pokémon matches and character perspectives are generated for playful self-reflection and should not be treated as professional, medical, psychological, financial, or legal advice. 🎮✨