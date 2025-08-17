const fs = require('fs');
const pdfParse = require('pdf-parse');

async function main() {
  const data = fs.readFileSync('./public/bible_de_jerusalem.pdf');
  const pdf = await pdfParse(data);
  const lines = pdf.text.split('\n');
  // Cherche la vraie première occurrence de "Genèse" suivie d'un contenu non paginé
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === 'Genèse' && lines[i+1] && !lines[i+1].includes('...')) {
      startIdx = i;
      break;
    }
  }
  if (startIdx === -1) {
    console.log('Genèse non trouvée');
    return;
  }
  // Affiche 200 lignes à partir du vrai début de la Genèse
  for (const line of lines.slice(startIdx, startIdx+200)) {
    console.log(line);
  }
}

main();
