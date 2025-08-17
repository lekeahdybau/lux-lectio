"use client"

import { useState, useEffect } from "react"
import { Sun, Sunrise, Sunset, Moon, Star, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLiturgical } from "@/components/liturgical-provider"

const offices = [
  {
    id: "office-lectures",
    name: "Office des lectures",
    time: "Nuit",
    icon: Star,
    description: "Prière de la nuit avec lectures patristiques",
  },
  {
    id: "laudes",
    name: "Laudes",
    time: "Matin",
    icon: Sunrise,
    description: "Prière du matin, louange de l'aurore",
  },
  {
    id: "tierce",
    name: "Tierce",
    time: "9h",
    icon: Sun,
    description: "Prière de la troisième heure",
  },
  {
    id: "sexte",
    name: "Sexte",
    time: "12h",
    icon: Sun,
    description: "Prière de la sixième heure",
  },
  {
    id: "none",
    name: "None",
    time: "15h",
    icon: Sun,
    description: "Prière de la neuvième heure",
  },
  {
    id: "vepres",
    name: "Vêpres",
    time: "Soir",
    icon: Sunset,
    description: "Prière du soir, action de grâce",
  },
  {
    id: "complies",
    name: "Complies",
    time: "Nuit",
    icon: Moon,
    description: "Prière avant le repos nocturne",
  },
]

export default function OfficesPage() {
  const { liturgicalData, currentDate } = useLiturgical()
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null)
  const [officeData, setOfficeData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatLiturgicalDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }


  // Récupération dynamique de l'office sélectionné
  useEffect(() => {
    if (!selectedOffice) {
      setOfficeData(null)
      setError(null)
      return
    }
    const fetchOffice = async () => {
      setLoading(true)
      setError(null)
      try {
        const dateStr = currentDate.toISOString().split("T")[0]
        // L'API attend "office-lectures" => "office_lectures"
        const officeParam = selectedOffice.replace("-", "_")
        const res = await fetch(`/api/aelf/offices?date=${dateStr}&office=${officeParam}`)
        if (!res.ok) throw new Error("Erreur lors de la récupération de l'office")
        const data = await res.json()
        // On prend data.data si présent, sinon data directement (compatibilité)
        setOfficeData(data.data || data)
      } catch (e: any) {
        setError(e.message || "Erreur inconnue")
        setOfficeData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchOffice()
  }, [selectedOffice, currentDate])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-liturgical-primary mb-2">Offices des heures</h1>
        <p className="text-muted-foreground">La prière de l'Église pour sanctifier les heures du jour</p>
        <p className="text-sm text-liturgical-primary font-medium mt-2">{formatLiturgicalDate(currentDate)}</p>
      </div>

      {!selectedOffice ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offices.map((office) => (
            <Card
              key={office.id}
              className="cursor-pointer hover:shadow-lg transition-shadow border-liturgical-primary/20 hover:border-liturgical-primary/40"
              onClick={() => setSelectedOffice(office.id)}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <office.icon className="h-8 w-8 text-liturgical-primary" />
                </div>
                <CardTitle className="text-liturgical-primary">{office.name}</CardTitle>
                <Badge variant="secondary" className="mx-auto">
                  {office.time}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-muted-foreground">{office.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-liturgical-primary">
              {offices.find((o) => o.id === selectedOffice)?.name}
            </h2>
            <Button variant="outline" onClick={() => setSelectedOffice(null)}>
              Retour aux offices
            </Button>
          </div>

          {/* Affichage dynamique de l'office */}
          {loading && (
            <Card><CardContent className="p-8 text-center">Chargement...</CardContent></Card>
          )}
          {error && (
            <Card><CardContent className="p-8 text-center text-red-600">{error}</CardContent></Card>
          )}
          {!loading && !error && officeData && (
            officeData.html ? (
              <Card className="border-liturgical-primary/30">
                <CardHeader>
                  <CardTitle className="text-liturgical-primary">Office (données brutes du site AELF)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: officeData.html }} />
                  {officeData.note && (
                    <p className="mt-4 text-xs text-muted-foreground italic">{officeData.note}</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Antienne d'ouverture */}
                {officeData.antienne && (
                  <Card className="border-liturgical-primary/30">
                    <CardHeader>
                      <CardTitle className="text-liturgical-primary">Antienne d'ouverture</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="italic text-liturgical-primary font-medium">{officeData.antienne}</p>
                    </CardContent>
                  </Card>
                )}
                {/* Psaumes */}
                {officeData.psaumes?.map((psaume: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {psaume.numero} - {psaume.titre}
                      </CardTitle>
                      <p className="text-sm italic text-muted-foreground">Ant. {psaume.antienne}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p>{psaume.texte}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/* Cantique */}
                {officeData.cantique && (
                  <Card className="border-amber-200 dark:border-amber-800">
                    <CardHeader>
                      <CardTitle className="text-amber-800 dark:text-amber-200">{officeData.cantique.reference}</CardTitle>
                      <p className="text-sm italic text-amber-600 dark:text-amber-300">
                        Ant. {officeData.cantique.antienne}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p>{officeData.cantique.texte}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {/* Lecture */}
                {officeData.lecture && (
                  <Card className="border-blue-200 dark:border-blue-800">
                    <CardHeader>
                      <CardTitle className="text-blue-800 dark:text-blue-200">{officeData.lecture.titre}</CardTitle>
                      <p className="text-sm text-blue-600 dark:text-blue-300">{officeData.lecture.reference}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p>{officeData.lecture.texte}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {/* Responsoire */}
                {officeData.responsoire && (
                  <Card className="bg-liturgical-primary/5">
                    <CardContent className="p-4">
                      <p className="text-liturgical-primary font-medium">{officeData.responsoire}</p>
                    </CardContent>
                  </Card>
                )}
                {/* Prière */}
                {officeData.priere && (
                  <Card className="border-liturgical-primary/30">
                    <CardHeader>
                      <CardTitle className="text-liturgical-primary">Prière</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="italic">{officeData.priere}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
