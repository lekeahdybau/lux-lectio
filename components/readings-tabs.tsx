"use client"

import { useLiturgical } from "@/components/liturgical-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { MassReadings } from "./mass-readings"
import { OfficeReadings } from "./office-readings"
import { AelfMesse, AelfOffice } from "@/lib/types/aelf"

const OFFICE_ORDER = [
  "lectures",
  "laudes",
  "tierce",
  "sexte",
  "none",
  "vepres",
  "complies"
]

// Composant de chargement
function LoadingReadings() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  )
}

export function ReadingsTabs() {
  const { liturgicalData, loading, error } = useLiturgical()

  if (loading) {
    return <LoadingReadings />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!liturgicalData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Données non disponibles</AlertTitle>
        <AlertDescription>
          Les lectures liturgiques ne sont pas disponibles pour le moment.
        </AlertDescription>
      </Alert>
    )
  }

  // Filtrer et trier les offices
  const sortedOffices = Object.entries(liturgicalData.offices || {})
    .sort(([keyA], [keyB]) => {
      const indexA = OFFICE_ORDER.indexOf(keyA)
      const indexB = OFFICE_ORDER.indexOf(keyB)
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
    .map(([key, office]) => ({
      key,
      ...office
    }))

  // Gérer le cas où il n'y a ni messes ni offices
  if ((!liturgicalData.messes || liturgicalData.messes.length === 0) && 
      (!liturgicalData.offices || Object.keys(liturgicalData.offices).length === 0)) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Aucune lecture disponible</AlertTitle>
        <AlertDescription>
          Il n'y a pas de lectures disponibles pour cette date.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Tabs defaultValue="messe" className="w-full">
      <TabsList className="w-full justify-start mb-4">
        {liturgicalData.messes && liturgicalData.messes.length > 0 && (
          <TabsTrigger value="messe">Messe</TabsTrigger>
        )}
        {sortedOffices.length > 0 && (
          <TabsTrigger value="offices">Offices</TabsTrigger>
        )}
      </TabsList>

      {/* Contenu des messes */}
      {liturgicalData.messes && liturgicalData.messes.length > 0 && (
        <TabsContent value="messe" className="mt-4">
          <div className="space-y-8">
            {liturgicalData.messes.map((messe, index) => (
              <MassReadings key={index} messe={messe} />
            ))}
          </div>
        </TabsContent>
      )}

      {/* Contenu des offices */}
      {sortedOffices.length > 0 && (
        <TabsContent value="offices" className="mt-4">
          <div className="space-y-8">
            {sortedOffices.map((office) => (
              <OfficeReadings key={office.key} office={office} />
            ))}
          </div>
        </TabsContent>
      )}
    </Tabs>
  )
}
