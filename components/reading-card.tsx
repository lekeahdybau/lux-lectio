import React from "react"
import type { AelfReading } from "@/lib/api";

// Map d'abréviations des livres bibliques vers leurs noms complets
const bookAbbreviations: Record<string, string> = {
	'Gn': 'Genèse', 'Ex': 'Exode', 'Lv': 'Lévitique', 'Nb': 'Nombres', 'Dt': 'Deutéronome',
	'Jos': 'Josué', 'Jg': 'Juges', 'Rt': 'Ruth', '1S': '1 Samuel', '2S': '2 Samuel',
	'1R': '1 Rois', '2R': '2 Rois', '1Ch': '1 Chroniques', '2Ch': '2 Chroniques',
	'Esd': 'Esdras', 'Ne': 'Néhémie', 'Tb': 'Tobit', 'Jdt': 'Judith', 'Est': 'Esther',
	'1M': '1 Maccabées', '2M': '2 Maccabées', 'Jb': 'Job', 'Ps': 'Psaumes', 'Pr': 'Proverbes',
	'Qo': 'Qohélet', 'Ct': 'Cantique des Cantiques', 'Sg': 'Sagesse', 'Si': 'Siracide',
	'Is': 'Isaïe', 'Jr': 'Jérémie', 'Lm': 'Lamentations', 'Ba': 'Baruch', 'Ez': 'Ézéchiel',
	'Dn': 'Daniel', 'Os': 'Osée', 'Jl': 'Joël', 'Am': 'Amos', 'Ab': 'Abdias',
	'Jon': 'Jonas', 'Mi': 'Michée', 'Na': 'Nahum', 'Ha': 'Habacuc', 'So': 'Sophonie',
	'Ag': 'Aggée', 'Za': 'Zacharie', 'Ml': 'Malachie',
	'Mt': 'Matthieu', 'Mc': 'Marc', 'Lc': 'Luc', 'Jn': 'Jean',
	'Ac': 'Actes des Apôtres', 'Rm': 'Romains', '1Co': '1 Corinthiens', '2Co': '2 Corinthiens',
	'Ga': 'Galates', 'Ep': 'Éphésiens', 'Ph': 'Philippiens', 'Col': 'Colossiens',
	'1Th': '1 Thessaloniciens', '2Th': '2 Thessaloniciens', '1Tm': '1 Timothée', '2Tm': '2 Timothée',
	'Tt': 'Tite', 'Phm': 'Philémon', 'He': 'Hébreux', 'Jc': 'Jacques', '1P': '1 Pierre',
	'2P': '2 Pierre', '1Jn': '1 Jean', '2Jn': '2 Jean', '3Jn': '3 Jean', 'Jd': 'Jude',
	'Ap': 'Apocalypse'
};

// Fonction pour extraire le nom complet du livre à partir de la référence

interface ReadingCardProps {
  // We accept partial runtime objects because upstream data can be incomplete
  reading: Partial<AelfReading>;
  className?: string;
}

const typeLabels: Record<string, string> = {
  lecture_1: "1ère lecture",
  lecture_2: "2e lecture",
  lecture_3: "3e lecture",
  psaume: "Psaume",
  cantique: "Cantique",
  evangile: "Évangile",
}


export function ReadingCard({ reading, className = "" }: ReadingCardProps) {
  const type = reading.type || "";
  const reference = reading.reference || reading.ref || "";
  const descriptiveTitle = (reading as any).descriptiveTitle || reading.titre || reading.intro_lue || "";
  const excerpt = (reading as any).excerpt || reading.titre || reading.intro_lue || "";

  return (
    <div className={`w-full my-6 ${className}`}>
      {/* En-tête avec type et référence */}
      <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border-l-4 border-purple-500">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0"> {/* Conteneur qui peut rétrécir */}
            <span className="text-2xl flex-shrink-0">
              {type === 'psaume' ? '🎵' : type === 'evangile' ? '✝️' : '📖'}
            </span>
            <span className="font-bold text-sm md:text-base text-gray-800 dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">
              {descriptiveTitle}
            </span>
          </div>
          {reference && (
            <span className="text-xs md:text-sm font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
              {reference}
            </span>
          )}
        </div>
      </div>

      {/* Titre/Extrait de la lecture */}
      {excerpt && (
        <div className="mb-4 text-center">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-tight">
            {excerpt}
          </h3>
        </div>
      )}

      {/* Refrain psalmique */}
  {reading.refrain_psalmique && (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6 italic border-l-4 border-green-500">
          <div className="text-green-800 dark:text-green-200 font-medium text-center">
            <span className="text-green-600 dark:text-green-400 font-bold mr-2">Refrain :</span>
            <span dangerouslySetInnerHTML={{ __html: reading.refrain_psalmique }} />
          </div>
        </div>
      )}

      {/* Verset d'évangile */}
      {reading.verset_evangile && (
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-6 border-l-4 border-amber-500">
          <div className="text-amber-800 dark:text-amber-200 text-center">
            <span className="text-amber-600 dark:text-amber-400 font-bold mr-2">Verset :</span>
            <span dangerouslySetInnerHTML={{ __html: reading.verset_evangile }} />
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
        <div
          className={`prose prose-lg max-w-none dark:prose-invert leading-relaxed ${type === "psaume" ? "italic text-center" : ""}`}
          dangerouslySetInnerHTML={{ __html: reading.contenu || "" }}
        />
      </div>
    </div>
  )
}

