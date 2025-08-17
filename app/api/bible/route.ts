import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import pdfParse from "pdf-parse"

// Cache mémoire global pour la Bible indexée
let bibleCache: null | Record<string, Record<string, string>> = null
let cacheReady = false
let cachePromise: Promise<void> | null = null

// Table de correspondance livre -> regex titre PDF (à affiner selon la structure du PDF)
const bookTitleMap: Record<string, string> = {
  gn: "Genèse",
  ex: "Exode",
  lv: "Lévitique",
  nb: "Nombres",
  dt: "Deutéronome",
  jos: "Josué",
  jg: "Juges",
  rt: "Ruth",
  '1s': "1 Samuel",
  '2s': "2 Samuel",
  '1r': "1 Rois",
  '2r': "2 Rois",
  ps: "Psaumes",
  pr: "Proverbes",
  is: "Isaïe",
  jr: "Jérémie",
  ez: "Ézéchiel",
  dn: "Daniel",
  mt: "Matthieu",
  mc: "Marc",
  lc: "Luc",
  jn: "Jean",
  ac: "Actes",
  rm: "Romains",
  '1co': "1 Corinthiens",
  '2co': "2 Corinthiens",
  ga: "Galates",
  ep: "Éphésiens",
  ph: "Philippiens",
  col: "Colossiens",
  '1th': "1 Thessaloniciens",
  '2th': "2 Thessaloniciens",
  '1tm': "1 Timothée",
  '2tm': "2 Timothée",
  tt: "Tite",
  phm: "Philémon",
  he: "Hébreux",
  jc: "Jacques",
  '1p': "1 Pierre",
  '2p': "2 Pierre",
  '1jn': "1 Jean",
  '2jn': "2 Jean",
  '3jn': "3 Jean",
  jude: "Jude",
  ap: "Apocalypse",
}


// Fonction d'indexation globale (à affiner selon la structure réelle du PDF)
async function buildBibleCache() {
  if (bibleCache) return
  cacheReady = false
  const pdfPath = "/workspaces/lux-lectio/public/bible_de_jerusalem.pdf"
  const data = await fs.readFile(pdfPath)
  const pdf = await pdfParse(data)
  const lines = pdf.text.split('\n')
  const cache: Record<string, Record<string, string>> = {}
  // On ignore le sommaire : on commence à la première vraie occurrence du titre de livre suivi d'un contenu non paginé
  for (const [bookId, bookTitle] of Object.entries(bookTitleMap)) {
    // Cherche la première vraie occurrence du titre (hors sommaire)
    let startIdx = -1
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === bookTitle && lines[i+1] && !lines[i+1].includes('...')) {
        startIdx = i
        break
      }
    }
    if (startIdx === -1) continue
    // Cherche la fin du livre (début du livre suivant)
    let endIdx = lines.length
    const bookTitles = Object.values(bookTitleMap)
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (bookTitles.includes(lines[i].trim()) && i > startIdx + 5) {
        endIdx = i
        break
      }
    }
    const bookLines = lines.slice(startIdx, endIdx)
    cache[bookId] = {}
    // Découpage par chapitres : on cherche les lignes commençant par 'Genèse N,' (ou autre livre)
    // On généralise pour tous les livres
    const bookPrefix = bookTitle.split(' ')[0] // ex: 'Genèse', 'Exode', ...
    let currentChapter = null
    let currentText = []
    for (const line of bookLines) {
      const chapMatch = line.match(new RegExp(`^${bookPrefix} (\\d+),`))
      if (chapMatch) {
        const chapNum = chapMatch[1]
        if (currentChapter && currentText.length > 0 && chapNum !== currentChapter) {
          cache[bookId][currentChapter] = currentText.join('\n')
          currentText = []
        }
        currentChapter = chapNum
        currentText.push(line)
      } else if (currentChapter) {
        currentText.push(line)
      }
    }
    // Dernier chapitre
    if (currentChapter && currentText.length > 0) {
      cache[bookId][currentChapter] = currentText.join('\n')
    }
  }
  bibleCache = cache
  cacheReady = true
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const book = searchParams.get("book")
  const chapter = searchParams.get("chapter")

  if (!book || !chapter) {
    return NextResponse.json({ error: "Paramètres 'book' et 'chapter' requis." }, { status: 400 })
  }

  // Démarre l'indexation si besoin (une seule fois)
  if (!bibleCache && !cachePromise) {
    cachePromise = buildBibleCache()
  }
  if (cachePromise) {
    await cachePromise
  }

  if (!bibleCache || !bibleCache[book] || !bibleCache[book][chapter]) {
    return NextResponse.json({
      content: `<div class='text-center py-8'>Chapitre non trouvé dans la Bible de Jérusalem. <br/>Merci de signaler ce bug ou d'essayer un autre chapitre.</div>`
    })
  }

  // Extraction instantanée depuis le cache
  const chapterText = bibleCache[book][chapter]
  const clean = chapterText
    .replace(/\n/g, '<br/>')
    .replace(/\s{2,}/g, ' ')
    .replace(/(<br\/>)+/g, '<br/>')
  return NextResponse.json({
    content: `<div class='prose prose-sm max-w-none dark:prose-invert'>${clean}</div>`
  })
}
