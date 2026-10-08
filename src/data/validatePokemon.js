// Comprehensive validation script for pokemon151.json
// Verifies schema, ID sequences, uniqueness, dimension ratings, canonical data, and statistical distribution

const fs = require('fs');
const path = require('path');

const EXPECTED_DIMENSIONS = [
  'confidence',
  'persistence',
  'adaptability',
  'courage',
  'patience',
  'calm'
];

function validateDataset() {
  const filePath = path.join(__dirname, 'pokemon151.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);

  const errors = [];
  const seenIds = new Set();
  const seenNames = new Set();

  // 1. Length check
  if (!Array.isArray(data)) {
    errors.push("Dataset root must be an array.");
    return reportResults(errors);
  }

  if (data.length !== 151) {
    errors.push(`Expected exactly 151 Pokémon, found ${data.length}`);
  }

  // Dimension rating distribution accumulators
  const dimensionAverages = {};
  EXPECTED_DIMENSIONS.forEach(d => { dimensionAverages[d] = 0; });

  data.forEach((poke, index) => {
    const entryNum = index + 1;

    // 2. ID integrity
    if (typeof poke.id !== 'number' || !Number.isInteger(poke.id)) {
      errors.push(`[Entry #${entryNum}] id must be an integer, got: ${poke.id}`);
    } else {
      if (poke.id !== entryNum) {
        errors.push(`[Entry #${entryNum}] Expected id ${entryNum}, but got ${poke.id}`);
      }
      if (poke.id < 1 || poke.id > 151) {
        errors.push(`[Entry #${entryNum}] id ${poke.id} out of bounds (1-151)`);
      }
      if (seenIds.has(poke.id)) {
        errors.push(`[Entry #${entryNum}] Duplicate id ${poke.id}`);
      }
      seenIds.add(poke.id);
    }

    // 3. Name integrity
    if (typeof poke.name !== 'string' || poke.name.trim().length === 0) {
      errors.push(`[Entry #${entryNum}] Invalid or missing name`);
    } else {
      if (seenNames.has(poke.name.toLowerCase())) {
        errors.push(`[Entry #${entryNum}] Duplicate name: ${poke.name}`);
      }
      seenNames.add(poke.name.toLowerCase());
    }

    // 4. Canonical data check
    if (!poke.canonical || typeof poke.canonical !== 'object') {
      errors.push(`[Entry #${entryNum} - ${poke.name}] Missing canonical object`);
    } else {
      if (poke.canonical.generation !== 1) {
        errors.push(`[Entry #${entryNum} - ${poke.name}] generation must strictly be 1`);
      }
      if (typeof poke.canonical.category !== 'string' || poke.canonical.category.trim().length === 0) {
        errors.push(`[Entry #${entryNum} - ${poke.name}] category must be a non-empty string`);
      }
      if (!Array.isArray(poke.canonical.types) || poke.canonical.types.length < 1 || poke.canonical.types.length > 2) {
        errors.push(`[Entry #${entryNum} - ${poke.name}] types must be an array of 1 or 2 strings`);
      }
    }

    // 5. Product interpretation check
    if (!poke.productInterpretation || typeof poke.productInterpretation !== 'object') {
      errors.push(`[Entry #${entryNum} - ${poke.name}] Missing productInterpretation object`);
    } else {
      const interp = poke.productInterpretation;
      if (typeof interp.archetype !== 'string' || interp.archetype.trim().length === 0) {
        errors.push(`[Entry #${entryNum} - ${poke.name}] archetype must be a non-empty string`);
      }
      if (!Array.isArray(interp.strengths) || interp.strengths.length < 2) {
        errors.push(`[Entry #${entryNum} - ${poke.name}] strengths must have at least 2 items`);
      }
      if (typeof interp.blindSpot !== 'string' || interp.blindSpot.trim().length === 0) {
        errors.push(`[Entry #${entryNum} - ${poke.name}] blindSpot must be a non-empty string`);
      }

      // 6. Dimension ratings check
      if (!interp.dimensionRatings || typeof interp.dimensionRatings !== 'object') {
        errors.push(`[Entry #${entryNum} - ${poke.name}] Missing dimensionRatings object`);
      } else {
        const ratings = interp.dimensionRatings;
        const ratingKeys = Object.keys(ratings);

        // Check key parity
        if (ratingKeys.length !== EXPECTED_DIMENSIONS.length) {
          errors.push(`[Entry #${entryNum} - ${poke.name}] Expected ${EXPECTED_DIMENSIONS.length} dimension keys, found ${ratingKeys.length}`);
        }

        EXPECTED_DIMENSIONS.forEach(dim => {
          const val = ratings[dim];
          if (typeof val !== 'number' || !Number.isInteger(val) || val < 1 || val > 5) {
            errors.push(`[Entry #${entryNum} - ${poke.name}] Dimension '${dim}' must be an integer between 1 and 5. Got: ${val}`);
          } else {
            dimensionAverages[dim] += val;
          }
        });
      }
    }
  });

  return reportResults(errors, data.length, dimensionAverages);
}

function reportResults(errors, count, averages) {
  console.log("\n================ POKÉMON DATASET VALIDATION REPORT ================");
  if (errors.length > 0) {
    console.error(`❌ Validation FAILED with ${errors.length} error(s):`);
    errors.slice(0, 15).forEach(err => console.error(`  - ${err}`));
    if (errors.length > 15) console.error(`  ... and ${errors.length - 15} more`);
    process.exit(1);
  }

  console.log(`✅ Total Pokémon Validated: ${count} / 151`);
  console.log("✅ All IDs strictly 1-151 in ascending order with no gaps or duplicates.");
  console.log("✅ Canonical metadata verified (Generation: 1, Category present, 1-2 Types).");
  console.log("✅ Product interpretations present (Archetypes, Strengths, Blind Spots).");
  console.log("✅ Dimension ratings verified (All integers 1-5 across all 6 dimensions).");
  console.log("\n--- Dimension Average Ratings Across All 151 Pokémon ---");
  for (const [dim, sum] of Object.entries(averages)) {
    const avg = (sum / count).toFixed(2);
    console.log(`  ${dim.padEnd(14)}: ${avg} / 5.00`);
  }
  console.log("===================================================================\n");
}

validateDataset();
