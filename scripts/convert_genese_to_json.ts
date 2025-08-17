import fs from 'fs';
import path from 'path';

// Chemins des fichiers
const inputPath = path.join(__dirname, 'genese.txt');
const outputPath = path.join(__dirname, '../public/genese.json');

// Lecture du texte brut
const raw = fs.readFileSync(inputPath, 'utf-8');

// Regex pour extraire chaque verset (exemple: 1,1 Au commencement...)
const verseRegex = /^(\d+),(\d+)\s+(.+)$/gm;

const results = [];
let match;
while ((match = verseRegex.exec(raw)) !== null) {
  const chapitre = parseInt(match[1], 10);
  const verset = parseInt(match[2], 10);
  const texte = match[3].trim();
  results.push({
    livre: 'Genèse',
    chapitre,
    verset,
    texte,
  });
}

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`Fichier JSON généré avec ${results.length} versets.`);
