const fs = require('fs');
const pdfParse = require('pdf-parse');

async function main() {
  const data = fs.readFileSync('./public/bible_de_jerusalem.pdf');
  const pdf = await pdfParse(data);
  const lines = pdf.text.split('\n');
  let inGenese = false;
  let genese = [];
  for (const line of lines) {
    if (line.trim().startsWith('Genèse')) inGenese = true;
    if (inGenese) genese.push(line);
    if (inGenese && line.trim().startsWith('Exode')) break;
  }
  for (const line of genese.slice(0, 100)) {
    console.log(line);
  }
}

main();
