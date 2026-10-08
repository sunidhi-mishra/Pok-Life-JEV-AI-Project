// Script to fetch canonical Gen-1 data (IDs 1-151) from PokeAPI and save canonical base file
const fs = require('fs');
const path = require('path');

async function fetchCanonical() {
  console.log("Fetching canonical data for Pokémon #1-151...");
  const results = [];

  for (let id = 1; id <= 151; id++) {
    process.stdout.write(`Fetching #${id}...\r`);
    const pRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!pRes.ok) throw new Error(`Failed to fetch pokemon ${id}`);
    const pData = await pRes.json();

    const sRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    if (!sRes.ok) throw new Error(`Failed to fetch species ${id}`);
    const sData = await sRes.json();

    const types = pData.types
      .sort((a, b) => a.slot - b.slot)
      .map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1));

    const genusEntry = sData.genera.find(g => g.language.name === 'en');
    const category = genusEntry ? genusEntry.genus : "Pokémon";

    // Format proper name (e.g. Nidoran♀, Nidoran♂, Mr. Mime, Farfetch'd)
    const nameEntry = sData.names.find(n => n.language.name === 'en');
    const name = nameEntry ? nameEntry.name : (pData.name.charAt(0).toUpperCase() + pData.name.slice(1));

    results.push({
      id,
      name,
      canonical: {
        category,
        generation: 1,
        types
      }
    });

    // Small delay to be respectful to PokeAPI
    await new Promise(r => setTimeout(r, 40));
  }

  const outDir = path.join(__dirname, 'scratch');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'canonical151.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\nSuccessfully saved 151 canonical records to ${outPath}`);
}

fetchCanonical().catch(err => {
  console.error("\nError:", err);
  process.exit(1);
});
