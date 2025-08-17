// Script de diagnostic complet de l'API AELF pour identifier les vrais endpoints

async function diagnoseAelfAPI() {
  const today = new Date().toISOString().split("T")[0]
  const testDate = "2024-12-25" // Noël - date avec beaucoup de lectures

  console.log("🔍 DIAGNOSTIC COMPLET DE L'API AELF")
  console.log("Date du jour:", today)
  console.log("Date de test:", testDate)
  console.log("=" * 50)

  // Endpoints officiels selon la documentation AELF
  const officialEndpoints = [
    `https://api.aelf.org/v1/messes/${today}`,
    `https://api.aelf.org/v1/messes/${today}/france`,
    `https://api.aelf.org/v1/informations/messe/${today}`,
    `https://api.aelf.org/v1/lectures/${today}`,

    // Test avec Noël
    `https://api.aelf.org/v1/messes/${testDate}`,
    `https://api.aelf.org/v1/messes/${testDate}/france`,
  ]

  // Endpoints alternatifs
  const alternativeEndpoints = [
    `https://www.aelf.org/api/v1/messes/${today}`,
    `https://nominis.cef.fr/api/messes/${today}`,
    `https://evangeli.net/api/evangile/${today}`,
  ]

  let workingEndpoint = null
  let sampleData = null

  console.log("\n📡 TEST DES ENDPOINTS OFFICIELS AELF")
  console.log("-" * 40)

  for (const url of officialEndpoints) {
    console.log(`\n🔍 Test: ${url}`)

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Referer: "https://www.aelf.org/",
          Origin: "https://www.aelf.org",
        },
      })

      console.log(`   Status: ${response.status} ${response.statusText}`)
      console.log(`   Content-Type: ${response.headers.get("content-type")}`)
      console.log(`   Headers:`, Object.fromEntries([...response.headers.entries()].slice(0, 5)))

      if (response.ok) {
        const contentType = response.headers.get("content-type") || ""

        if (contentType.includes("application/json")) {
          const data = await response.json()
          console.log("   ✅ SUCCÈS JSON!")
          console.log("   📊 Clés principales:", Object.keys(data))

          // Analyser la structure en détail
          if (data.messes) {
            console.log(`   📖 Messes: ${data.messes.length}`)
            if (data.messes[0]) {
              console.log("   📚 Structure messe:", Object.keys(data.messes[0]))
              if (data.messes[0].lectures) {
                console.log(`   📜 Lectures: ${data.messes[0].lectures.length}`)
                data.messes[0].lectures.forEach((lecture, i) => {
                  console.log(
                    `      ${i + 1}. ${lecture.type || "type?"} - ${lecture.titre?.substring(0, 30) || "titre?"}...`,
                  )
                })
              }
            }
          }

          if (data.informations) {
            console.log("   ℹ️ Informations:", data.informations)
          }

          if (!workingEndpoint) {
            workingEndpoint = url
            sampleData = data
          }

          // Afficher un échantillon
          console.log("   📄 Échantillon:")
          console.log(JSON.stringify(data, null, 2).substring(0, 800) + "...")
        } else {
          const text = await response.text()
          console.log("   ⚠️ Réponse non-JSON")
          console.log("   📄 Contenu:", text.substring(0, 200) + "...")
        }
      } else {
        const errorText = await response.text()
        console.log(`   ❌ Erreur HTTP ${response.status}`)
        console.log("   📄 Erreur:", errorText.substring(0, 200))
      }
    } catch (error) {
      console.log(`   ❌ Erreur réseau: ${error.message}`)
    }
  }

  console.log("\n📡 TEST DES ENDPOINTS ALTERNATIFS")
  console.log("-" * 40)

  for (const url of alternativeEndpoints) {
    console.log(`\n🔍 Test alternatif: ${url}`)

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "LuxLectio/2.0",
        },
      })

      console.log(`   Status: ${response.status}`)

      if (response.ok) {
        const contentType = response.headers.get("content-type") || ""
        if (contentType.includes("application/json")) {
          const data = await response.json()
          console.log("   ✅ Source alternative trouvée!")
          console.log("   📊 Structure:", Object.keys(data))
        }
      }
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`)
    }
  }

  console.log("\n" + "=" * 50)
  console.log("📋 RÉSUMÉ DU DIAGNOSTIC")
  console.log("=" * 50)

  if (workingEndpoint) {
    console.log(`✅ Endpoint fonctionnel trouvé: ${workingEndpoint}`)
    console.log("📊 Structure des données:")

    if (sampleData.messes && sampleData.messes[0] && sampleData.messes[0].lectures) {
      console.log("\n📚 LECTURES TROUVÉES:")
      sampleData.messes[0].lectures.forEach((lecture, i) => {
        console.log(`${i + 1}. Type: ${lecture.type}`)
        console.log(`   Titre: ${lecture.titre}`)
        console.log(`   Référence: ${lecture.ref}`)
        console.log(`   Contenu: ${lecture.contenu?.substring(0, 100)}...`)
        console.log("")
      })
    }

    console.log("\n🔧 RECOMMANDATIONS:")
    console.log("1. Utiliser cet endpoint dans l'application")
    console.log("2. Adapter la normalisation des données")
    console.log("3. Gérer les cas d'erreur avec fallback")
  } else {
    console.log("❌ Aucun endpoint AELF fonctionnel trouvé")
    console.log("🔧 SOLUTIONS:")
    console.log("1. Vérifier la connectivité réseau")
    console.log("2. L'API AELF pourrait être temporairement indisponible")
    console.log("3. Utiliser des sources alternatives")
    console.log("4. Implémenter un système de cache robuste")
  }

  console.log("\n🌐 Pour comparaison, visitez: https://www.aelf.org/")
  console.log("📅 Date testée:", today)
}

// Exécution immédiate
diagnoseAelfAPI().catch(console.error)
