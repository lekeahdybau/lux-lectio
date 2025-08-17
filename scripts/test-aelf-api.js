// Test direct de l'API AELF pour voir sa structure réelle

async function testAelfAPI() {
  const today = new Date().toISOString().split("T")[0]
  console.log("Test de l'API AELF pour la date:", today)

  // URLs possibles à tester
  const urls = [
    `https://api.aelf.org/v1/messes/${today}/france`,
    `https://api.aelf.org/v1/messes/${today}`,
    `https://api.aelf.org/messes/${today}/france`,
    `https://api.aelf.org/messes/${today}`,
    `https://www.aelf.org/api/v1/messes/${today}`,
    "https://api.aelf.org/v1/informations/messe",
    "https://api.aelf.org/v1/messes/2024-01-10/france",
  ]

  for (const url of urls) {
    try {
      console.log(`\n🔍 Test de: ${url}`)

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "LuxLectio/1.0",
        },
      })

      console.log(`Status: ${response.status} ${response.statusText}`)
      console.log("Headers:", Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const data = await response.json()
        console.log("✅ SUCCÈS! Structure des données:")
        console.log("Clés principales:", Object.keys(data))
        console.log("Données complètes:", JSON.stringify(data, null, 2))

        // Analysons la structure
        if (data.lectures) {
          console.log("📖 Lectures trouvées:", Object.keys(data.lectures))
        }
        if (data.messe) {
          console.log("⛪ Messe:", data.messe)
        }
        if (data.informations) {
          console.log("ℹ️ Informations:", data.informations)
        }

        return data // Retournons les premières données trouvées
      } else {
        const errorText = await response.text()
        console.log("❌ Erreur:", errorText)
      }
    } catch (error) {
      console.log("❌ Erreur réseau:", error.message)
    }
  }

  console.log("\n🔍 Aucune URL n'a fonctionné. L'API AELF pourrait avoir une structure différente.")
}

// Exécution du test
testAelfAPI()
