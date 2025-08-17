const fs = require('fs');
const pdfParse = require('pdf-parse');

async function main() {
  const data = fs.readFileSync('./public/bible_de_jerusalem.pdf');
  const pdf = await pdfParse(data);
  const lines = pdf.text.split('\n').slice(0, 100);
  for (const line of lines) {
    console.log(line);
  }
}

main();
