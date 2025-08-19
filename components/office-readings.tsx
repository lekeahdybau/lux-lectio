"use client"

import { useState } from "react"
import { AelfOffice, AelfLecture } from "@/lib/types/aelf"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface OfficeReadingsProps {
  office: AelfOffice
}

interface SectionType {
  id: string
  label: string
  emoji: string
  content: AelfLecture | AelfLecture[] | undefined
}

const sections: SectionType[] = [
  { id: "introduction", label: "Introduction", emoji: "📝", content: undefined },
  { id: "psaumes", label: "Psaumes", emoji: "🎵", content: undefined },
  { id: "lectures", label: "Lectures", emoji: "📖", content: undefined },
  { id: "pericopes", label: "Péricopes", emoji: "📜", content: undefined },
  { id: "cantique", label: "Cantique", emoji: "🎼", content: undefined },
  { id: "conclusion", label: "Conclusion", emoji: "✨", content: undefined },
]

export function OfficeReadings({ office }: OfficeReadingsProps) {
  const [activeSection, setActiveSection] = useState<string>("introduction")

  if (!office.office) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Office non disponible</AlertTitle>
        <AlertDescription>
          Le contenu de cet office n'est pas disponible.
        </AlertDescription>
      </Alert>
    )
  }

  const {
    introduction,
    lectures,
    cantique,
    psaumes,
    pericopes,
    conclusion
  } = office.office

  // Met à jour les sections avec le contenu disponible
  const availableSections = sections.map(section => ({
    ...section,
    content: office.office[section.id as keyof typeof office.office]
  })).filter(section => section.content)

  const renderContent = (content: AelfLecture | AelfLecture[] | undefined) => {
    if (!content) return null

    const renderLecture = (lecture: AelfLecture) => (
      <div className="space-y-4">
        {/* Titre */}
        {lecture.titre && (
          <h3 className="text-xl font-semibold text-liturgical-primary">
            {lecture.titre}
          </h3>
        )}

        {/* Référence */}
        {lecture.ref && (
          <p className="text-sm text-muted-foreground font-medium">
            {lecture.ref}
          </p>
        )}

        {/* Introduction */}
        {lecture.intro && (
          <div 
            className="text-sm italic text-muted-foreground border-l-2 border-liturgical-primary/20 pl-4"
            dangerouslySetInnerHTML={{ __html: lecture.intro }}
          />
        )}

        {/* Contenu principal */}
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: lecture.contenu }}
        />

        {/* Antienne */}
        {lecture.antienne && (
          <div 
            className="text-sm text-liturgical-secondary font-medium mt-4 border-l-2 border-liturgical-secondary pl-4"
            dangerouslySetInnerHTML={{ __html: lecture.antienne }}
          />
        )}

        {/* Répons */}
        {lecture.repons && (
          <div 
            className="text-sm italic text-muted-foreground mt-4"
            dangerouslySetInnerHTML={{ __html: lecture.repons }}
          />
        )}
      </div>
    )

    return Array.isArray(content) ? (
      <div className="space-y-8">
        {content.map((item, index) => (
          <div key={index} className="border-t first:border-t-0 pt-4 first:pt-0">
            {renderLecture(item)}
          </div>
        ))}
      </div>
    ) : renderLecture(content)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-liturgical-primary">
          {office.nom}
        </h2>
      </div>

      {/* Navigation */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {availableSections.map(section => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              className={`min-w-[120px] ${
                activeSection === section.id 
                  ? "bg-liturgical-primary hover:bg-liturgical-primary/90" 
                  : "hover:bg-liturgical-primary/10"
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="mr-2">{section.emoji}</span>
              {section.label}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Contenu */}
      <Card className="p-6 animate-slide-in">
        {renderContent(availableSections.find(s => s.id === activeSection)?.content)}
      </Card>
    </div>
  )
}
