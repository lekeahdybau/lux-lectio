// Ce script corrige toutes les clés non citées dans genese.json (chapitre, versets, verset, texte)
// Usage : node fix-genese-json.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'genese.json');
let content = fs.readFileSync(filePath, 'utf8');

// Correction des clés non citées (uniquement si elles ne sont pas déjà entre guillemets)
content = content.replace(/(\{|,|\[)\s*(chapitre|versets|verset|texte)\s*:/g, '$1"$2":');

// Optionnel : correction des clés vides ou objets vides (pour éviter des erreurs JSON)
content = content.replace(/\{\s*\}/g, '{}');
content = content.replace(/,\s*\}/g, '}');
content = content.replace(/,\s*\]/g, ']');

// On peut aussi tenter de valider le JSON
try {
  JSON.parse(content);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Correction terminée. Le fichier est maintenant un JSON valide avec toutes les clés citées.');
} catch (e) {
  console.error('Erreur de validation JSON après correction :', e.message);
  process.exit(1);
}
