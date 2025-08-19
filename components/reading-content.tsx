"use client"

import { Card } from "@/components/ui/card"
import { AelfLecture } from "@/lib/types/aelf"
import { cn } from "@/lib/utils"

interface ReadingContentProps {
  lecture: AelfLecture
  className?: string
}

export function ReadingContent({ lecture, className }: ReadingContentProps) {
  return (
    <Card className={cn("p-6 animate-fade-in", className)}>
      {/* En-tête de la lecture */}
      <div className="mb-4">
        {lecture.titre && (
          <h3 className="text-xl font-semibold mb-2">{lecture.titre}</h3>
        )}
        {lecture.ref && (
          <p className="text-sm text-muted-foreground">{lecture.ref}</p>
        )}
      </div>

      {/* Introduction si présente */}
      {lecture.intro && (
        <div 
          className="text-sm italic mb-4 text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: lecture.intro }}
        />
      )}

      {/* Contenu principal */}
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: lecture.contenu }}
      />

      {/* Verset si présent */}
      {lecture.verset && (
        <div 
          className="mt-4 text-sm font-medium text-liturgical-primary"
          dangerouslySetInnerHTML={{ __html: lecture.verset }}
        />
      )}

      {/* Répons si présent */}
      {lecture.repons && (
        <div 
          className="mt-4 text-sm italic text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: lecture.repons }}
        />
      )}

      {/* Antienne si présente */}
      {lecture.antienne && (
        <div 
          className="mt-4 text-sm font-medium text-liturgical-secondary"
          dangerouslySetInnerHTML={{ __html: lecture.antienne }}
        />
      )}
    </Card>
  )
}
