// Ce script tente de corriger les erreurs de structure JSON courantes (virgules en trop, objets/arrays vides, accolades mal fermées)
// Usage : node fix-json-structure.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'genese.json');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Supprimer les virgules en trop avant les crochets ou accolades fermantes
content = content.replace(/,\s*([}\]])/g, '$1');

// 2. Corriger les objets vides mal formés
content = content.replace(/\{\s*\}/g, '{}');

// 3. Corriger les tableaux vides mal formés
content = content.replace(/\[\s*\]/g, '[]');

// 4. Supprimer les éléments vides dans les tableaux d'objets (ex: { },)
content = content.replace(/\{\s*\},/g, '');

// 5. Supprimer les lignes contenant uniquement des accolades ou crochets vides
content = content.replace(/^\s*[\{\}\[\]]\s*$/gm, '');

// 6. Nettoyer les doubles virgules accidentelles
content = content.replace(/,,+/g, ',');

// 7. Retenter la validation
try {
  JSON.parse(content);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Structure JSON corrigée et validée.');
} catch (e) {
  console.error('Erreur persistante de structure JSON :', e.message);
  process.exit(1);
}
