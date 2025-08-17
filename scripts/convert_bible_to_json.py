

import re
import json

INPUT_FILE = "genese.txt"
OUTPUT_FILE = "public/genese.json"

# On découpe sur chaque début de verset "Genèse X, Y"
VERSE_SPLIT = re.compile(r'(Genèse \d+, \d+)')

versets = []

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    text = f.read().replace('\n', ' ')
    # On split sur chaque occurrence de Genèse X, Y
    parts = VERSE_SPLIT.split(text)
    # parts[0] = texte avant le premier verset (souvent vide ou titre)
    for i in range(1, len(parts), 2):
        ref = parts[i].strip()  # ex: Genèse 1, 1
        content = parts[i+1].strip() if i+1 < len(parts) else ''
        m = re.match(r'Genèse (\d+), (\d+)', ref)
        if m:
            chapitre = int(m.group(1))
            verset = int(m.group(2))
            texte = content
            # Nettoyage: si un autre verset commence dans le texte, on coupe
            next_verse = VERSE_SPLIT.search(texte)
            if next_verse:
                texte = texte[:next_verse.start()].strip()
            versets.append({
                "livre": "Genèse",
                "chapitre": chapitre,
                "verset": verset,
                "texte": texte
            })

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(versets, f, ensure_ascii=False, indent=2)

print(f"Exporté {len(versets)} versets dans {OUTPUT_FILE}")
