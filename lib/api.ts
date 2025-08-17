// Service API pour récupérer les données liturgiques

export interface AelfReading {
  titre: string
  contenu: string
  reference?: string
  ref?: string
  type?: string
  refrain_psalmique?: string
  verset_evangile?: string
  intro_lue?: string
}

export interface AelfData {
  informations: {
    date: string
    jour_liturgique_nom: string
    couleur: string
    temps_liturgique?: string
    semaine?: string
    fete?: string
  }
  lectures: Record<string, AelfReading>
  messes: {
    nom: string
    lectures: AelfReading[]
  }[]
}

export async function fetchLiturgicalReadings(date: string): Promise<AelfData> {
  try {
    const response = await fetch(`/api/aelf?date=${date}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erreur lors de la récupération des lectures:", error)
    throw error
  }
}

export function formatLiturgicalDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatApiDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

// Fonction pour obtenir la couleur liturgique
export function getLiturgicalColor(colorName: string): string {
  const colors: Record<string, string> = {
    blanc: "bg-blue-50 text-blue-800",
    rouge: "bg-red-50 text-red-800",
    vert: "bg-green-50 text-green-800",
    violet: "bg-purple-50 text-purple-800",
    rose: "bg-pink-50 text-pink-800",
    noir: "bg-gray-100 text-gray-800",
  }

  return colors[colorName.toLowerCase()] || "bg-green-50 text-green-800"
}
