import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ReadingCard } from "./reading-card"

interface MesseCarouselProps {
  messes: Array<{
    id: string
    nom: string
    lectures: any[] // tableau de lectures (AelfReading)
  }>
}

export function MesseCarousel({ messes }: MesseCarouselProps) {
  const [messeIndex, setMesseIndex] = useState(0)
  const currentMesse = messes[messeIndex]

  const goPrev = () => setMesseIndex((i) => (i > 0 ? i - 1 : messes.length - 1))
  const goNext = () => setMesseIndex((i) => (i < messes.length - 1 ? i + 1 : 0))

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
          onClick={goPrev}
          aria-label="Messe précédente"
        >
          <ChevronLeft className="w-6 h-6 text-blue-600 dark:text-blue-300" />
        </button>
        <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
          {currentMesse.nom}
        </div>
        <button
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
          onClick={goNext}
          aria-label="Messe suivante"
        >
          <ChevronRight className="w-6 h-6 text-blue-600 dark:text-blue-300" />
        </button>
      </div>
      <div className="w-full flex justify-center">
        {/* Carousel horizontal des lectures de la messe courante */}
        <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
          {currentMesse.lectures.map((lecture, idx) => (
            <div key={lecture.id || idx} className="min-w-[340px] max-w-[480px]">
              <ReadingCard reading={lecture} type={lecture.type} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// CSS pour masquer la scrollbar
// .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
// .hide-scrollbar::-webkit-scrollbar { display: none; }
