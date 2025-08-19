"use client"

import { useState } from "react"
import { AelfMesse } from "@/lib/types/aelf"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface MassReadingsProps {
  messe: AelfMesse
}

const typeLabels: Record<string, string> = {
  lecture_1: "1ère Lecture",
  lecture_2: "2e Lecture",
  epitre: "Épître",
  evangile: "Évangile",
  psaume: "Psaume",
  cantique: "Cantique",
}

const readingEmojis: Record<string, string> = {
  lecture_1: "📖",
  lecture_2: "📖",
  epitre: "✉️",
  evangile: "✝️",
  psaume: "🎵",
  cantique: "🎼",
}

export function MassReadings({ messe }: MassReadingsProps) {
  const [activeReading, setActiveReading] = useState<number>(0)

  if (!messe.lectures || messe.lectures.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Aucune lecture disponible</AlertTitle>
        <AlertDescription>
          Les lectures pour cette messe ne sont pas disponibles.
        </AlertDescription>
      </Alert>
    )
  }

  const currentReading = messe.lectures[activeReading]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête avec le nom de la messe */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-liturgical-primary">
          {messe.nom}
        </h2>
        <span className="text-sm text-muted-foreground">
          {messe.jour_liturgique_nom}
        </span>
      </div>

      {/* Navigation entre les lectures */}
      <div className="flex flex-wrap gap-2">
        {messe.lectures.map((lecture, index) => {
          const type = lecture.type || ""
          const isActive = index === activeReading
          
          return (
            <Button
              key={index}
              variant={isActive ? "default" : "outline"}
              className={`min-w-[120px] ${isActive ? "bg-liturgical-primary hover:bg-liturgical-primary/90" : "hover:bg-liturgical-primary/10"}`}
              onClick={() => setActiveReading(index)}
            >
              <span className="mr-2">
                {readingEmojis[type] || "📑"}
              </span>
              {typeLabels[type] || lecture.titre || `Lecture ${index + 1}`}
            </Button>
          )
        })}
      </div>

      {/* Affichage de la lecture courante */}
      <Card className="p-6 animate-slide-in">
        {/* Titre de la lecture */}
        {currentReading.titre && (
          <h3 className="text-xl font-semibold mb-4 text-liturgical-primary">
            {currentReading.titre}
          </h3>
        )}

        {/* Référence */}
        {currentReading.ref && (
          <p className="text-sm text-muted-foreground mb-4 font-medium">
            {currentReading.ref}
          </p>
        )}

        {/* Introduction */}
        {currentReading.intro && (
          <div 
            className="text-sm italic mb-4 text-muted-foreground border-l-2 border-liturgical-primary/20 pl-4"
            dangerouslySetInnerHTML={{ __html: currentReading.intro }} 
          />
        )}

        {/* Contenu principal */}
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: currentReading.contenu }}
        />

        {/* Verset */}
        {currentReading.verset && (
          <div
            className="mt-4 text-sm text-liturgical-primary font-medium border-l-2 border-liturgical-primary pl-4"
            dangerouslySetInnerHTML={{ __html: currentReading.verset }}
          />
        )}

        {/* Répons */}
        {currentReading.repons && (
          <div
            className="mt-4 text-sm italic text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: currentReading.repons }}
          />
        )}
      </Card>
    </div>
  )
}
