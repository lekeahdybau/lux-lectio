
// Script Node.js pour corriger l'italique dans tous les fichiers JSON de la Bible
// Règle : le texte n'est en italique que s'il commence et finit par un guillemet (même sur plusieurs versets)
// Usage : node scripts/fix_italics_quotes.js

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');

// Trouve tous les fichiers .json de la Bible dans /public
const bibleFiles = fs.readdirSync(PUBLIC_DIR).filter(f =>
  f.match(/^(genese|exode|levitique|nombres).*\.json$/)
);





function cleanItalics(verse) {
  if (typeof verse !== 'string') return verse;
  return verse.replace(/<\/?i>/g, '');
}

function replaceInternalQuotes(text) {
  // Remplace tous les guillemets français ou typographiques internes par "
  return text.replace(/[«»“”]/g, '"');
}





function fixFile(filePath) {
  const fullPath = path.join(PUBLIC_DIR, filePath);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (e) {
    console.error(`Erreur JSON dans ${filePath} : ${e.message}`);
    return;
  }
  let changed = false;
  if (Array.isArray(data)) {
    for (const chapitre of data) {
      if (!Array.isArray(chapitre.versets)) continue;
      let inSpeech = false;
      let speechStart = -1;
      for (let i = 0; i < chapitre.versets.length; i++) {
        let v = chapitre.versets[i];
        if (typeof v.texte !== 'string') continue;
        let txt = cleanItalics(v.texte);
        let trimmed = txt.trim();
        // Début de discours ?
        if (!inSpeech && (trimmed.startsWith('"') || trimmed.startsWith('«') || trimmed.startsWith('“'))) {
          inSpeech = true;
          speechStart = i;
        }
        // Fin de discours ?
        if (inSpeech && (trimmed.endsWith('"') || trimmed.endsWith('»') || trimmed.endsWith('”'))) {
          let speechEnd = i;
          // On applique l’italique sur tous les versets du discours
          for (let j = speechStart; j <= speechEnd; j++) {
            let t = cleanItalics(chapitre.versets[j].texte).trim();
            // On retire le guillemet ouvrant du premier verset
            if (j === speechStart) t = t.substring(1);
            // On retire le guillemet fermant du dernier verset
            if (j === speechEnd) t = t.substring(0, t.length - 1);
            t = replaceInternalQuotes(t);
            // Ajoute les guillemets extérieurs
            if (j === speechStart) t = '«<i>' + t;
            else t = '<i>' + t;
            if (j === speechEnd) t = t + '</i>»';
            else t = t + '</i>';
            if (t !== chapitre.versets[j].texte) {
              chapitre.versets[j].texte = t;
              changed = true;
            }
          }
          inSpeech = false;
        }
      }
      // Cas où il n'y a pas de discours sur plusieurs versets, on traite les autres versets normalement
      for (let i = 0; i < chapitre.versets.length; i++) {
        let v = chapitre.versets[i];
        if (typeof v.texte !== 'string' || v.texte === '') continue;
        let txt = cleanItalics(v.texte);
        let trimmed = txt.trim();
        // Si ce n'est pas un discours multi-versets, on traite comme avant
        const startsWithQuote = trimmed.startsWith('"') || trimmed.startsWith('«') || trimmed.startsWith('“');
        const endsWithQuote = trimmed.endsWith('"') || trimmed.endsWith('»') || trimmed.endsWith('”');
        if (startsWithQuote && endsWithQuote && trimmed.length > 1) {
          let inner = trimmed.slice(1, -1);
          inner = replaceInternalQuotes(inner);
          let newText = '«<i>' + inner + '</i>»';
          if (newText !== v.texte) {
            v.texte = newText;
            changed = true;
          }
        } else if (txt !== v.texte) {
          v.texte = txt;
          changed = true;
        }
      }
    }
  }
  // On force la réécriture du fichier, même si changed est faux, pour garantir la correction
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Corrigé : ${filePath}`);
}

for (const file of bibleFiles) {
  fixFile(file);
}

console.log('Correction italique terminée.');
