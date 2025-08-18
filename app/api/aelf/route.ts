import { type NextRequest, NextResponse } from "next/server"

// Fonction utilitaire pour générer une réponse d'erreur
function errorResponse(message: string, status: number = 500) {
  console.error(message);
  return NextResponse.json(
    { error: true, message },
    { 
      status,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      }
    }
  );
}

export const dynamic = 'force-dynamic'; // Désactive la mise en cache de la route

async function fetchWithTimeout(url: string, options: RequestInit & { timeout?: number }) {
  const { timeout = 5000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0]
  const zone = searchParams.get("zone") || "france"
  
  console.log(`📅 Requête lectures pour ${date} (zone: ${zone})`)

  try {
    console.log(`Récupération des lectures AELF pour ${date}`)

    // Endpoint principal AELF
    const endpoints = [
      `https://api.aelf.org/v1/messes/${date}/${zone}`,
      `https://api.aelf.org/v1/messes/${date}`,
      `https://www.aelf.org/api/v1/messes/${date}`
    ];
    
    let lastError = null;
    
    // Essayer chaque endpoint jusqu'à ce qu'un fonctionne
    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Tentative avec ${endpoint}`);
        
        const response = await fetchWithTimeout(endpoint, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Origin": "https://www.aelf.org",
        "Referer": "https://www.aelf.org/",
      },
      cache: 'no-store',
      next: { revalidate: 3600 }, // Cache d'une heure
    })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseText = await response.text();
        if (!responseText) {
          throw new Error('Réponse vide');
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('Erreur de parsing JSON:', e);
          throw new Error('Réponse invalide: ' + responseText.substring(0, 100));
        }

        if (!data || Object.keys(data).length === 0) {
          throw new Error('Données vides');
        }

        console.log('✅ Succès avec', endpoint);

    // Nouvelle normalisation : expose tous les champs riches de chaque lecture
    const normalizedData = {
      informations: {
        ...data.informations,
        date: data.informations?.date || date,
        jour_liturgique_nom: data.informations?.jour_liturgique_nom || data.informations?.nom || "Jour liturgique",
        couleur: data.informations?.couleur || "vert",
        temps_liturgique: data.informations?.temps_liturgique || "ordinaire",
        semaine: data.informations?.semaine || "",
        fete: data.informations?.fete || data.informations?.ligne2 || "",
      },
      messes: data.messes || [],
      lectures: {} as { [key: string]: any },
    }

    // Extraction complète des lectures, indexées par type, avec tous les champs
    // Traiter toutes les messes disponibles pour capturer toutes les lectures (notamment les vigiles pascales)
    if (normalizedData.messes?.length > 0) {
      normalizedData.messes.forEach((messe: any, messeIndex: number) => {
        if (messe.lectures) {
          // Grouper les lectures par type pour gérer les versions multiples (longue/brève)
          const lecturesByType: { [key: string]: any[] } = {}
          
          messe.lectures.forEach((lecture: any, lectureIndex: number) => {
            if (lecture.type) {
              if (!lecturesByType[lecture.type]) {
                lecturesByType[lecture.type] = []
              }
              lecturesByType[lecture.type].push({
                type: lecture.type,
                titre: lecture.titre || "",
                contenu: lecture.contenu || "",
                reference: lecture.reference || lecture.ref || "",
                ref: lecture.ref || lecture.reference || "",
                refrain_psalmique: lecture.refrain_psalmique || null,
                verset_evangile: lecture.verset_evangile || null,
                intro_lue: lecture.intro_lue || null,
                ref_refrain: lecture.ref_refrain || null,
                ref_verset: lecture.ref_verset || null,
                messe_nom: messe.nom || `Messe ${messeIndex + 1}`,
                messe_index: messeIndex,
                lecture_index: lectureIndex,
                version_index: lecturesByType[lecture.type].length, // Pour identifier longue/brève
              })
            }
          })
          
          // Ajouter les lectures groupées par type
          Object.keys(lecturesByType).forEach(type => {
            const lecturesOfType = lecturesByType[type]
            if (lecturesOfType.length === 1) {
              // Une seule version : utiliser directement le type comme clé
              const lectureKey = normalizedData.messes.length > 1 
                ? `${type}_messe${messeIndex}` 
                : type
              normalizedData.lectures[lectureKey] = lecturesOfType[0]
            } else {
              // Plusieurs versions : créer un tableau avec les versions
              const lectureKey = normalizedData.messes.length > 1 
                ? `${type}_messe${messeIndex}` 
                : type
              normalizedData.lectures[lectureKey] = {
                type: type,
                versions: lecturesOfType,
                messe_nom: messe.nom || `Messe ${messeIndex + 1}`,
                messe_index: messeIndex,
                has_multiple_versions: true,
              }
            }
          })
        }
      })
    }

    if (!normalizedData.messes?.length && !Object.keys(normalizedData.lectures || {}).length) {
      throw new Error('Aucune lecture disponible');
    }

    // Si nous arrivons ici, nous avons des données valides
    return NextResponse.json(normalizedData, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      },
    });

      } catch (error) {
        console.error(`❌ Échec avec ${endpoint}:`, error);
        lastError = error;
        continue;
      }
    }

    // Si nous arrivons ici, tous les endpoints ont échoué
    return errorResponse(
      `Impossible de récupérer les lectures (${lastError && (lastError as Error).message ? (lastError as Error).message : 'erreur inconnue'})`,
      503
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des lectures:", error);
    return errorResponse(error instanceof Error ? error.message : 'Erreur inconnue', 500);
  }
}
