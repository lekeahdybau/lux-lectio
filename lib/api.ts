// Service API pour récupérer les données liturgiques

export interface ReadingOption {
  titre?: string;
  contenu: string;
  reference?: string;
}

export interface AelfReading {
  titre?: string;
  contenu: string;
  reference?: string;
  ref?: string;
  type?: string;
  refrain_psalmique?: string;
  verset_evangile?: string;
  intro_lue?: string;
  versions?: {
    longue: ReadingOption;
    breve: ReadingOption;
  };
  choix?: ReadingOption[];
  psaume?: {
    contenu: string;
    choix?: ReadingOption[];
  };
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

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Dans le navigateur, utiliser l'URL relative
    return '';
  }
  // En dehors du navigateur (SSR), utiliser l'URL complète
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

async function isValidJson(response: Response): Promise<boolean> {
  try {
    const clone = response.clone();
    const text = await clone.text();
    console.log('Réponse brute:', text);
    if (!text || text.length === 0) return false;
    const json = JSON.parse(text);
    return json !== null && Object.keys(json).length > 0;
  } catch {
    return false;
  }
}

export async function fetchLiturgicalReadings(date: string): Promise<AelfData> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/aelf?date=${date}`;
    console.log('Appel à l\'API interne:', url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok || !(await isValidJson(response))) {
      const responseText = await response.text();
      console.error('Réponse API non valide:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });
      
      let errorMessage = `Erreur API: ${response.status}`;
      if (responseText) {
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `${errorMessage} - ${responseText}`;
        }
      }
      
      throw new Error("Réponse API non valide: " + responseText)
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
