import { NextResponse } from "next/server"

export async function GET() {
  const testDate = "2024-06-30" // Date que vous avez mentionnée
  const today = new Date().toISOString().split("T")[0]

  console.log("🧪 TEST RÉEL API AELF avec vraies lectures")
  console.log("Date de test:", testDate)
  console.log("Date du jour:", today)

  const results = {
    timestamp: new Date().toISOString(),
    testDate,
    today,
    tests: [] as any[],
    workingEndpoint: null as string | null,
    realData: null as any,
  }

  // Endpoints à tester avec la vraie date
  const endpoints = [
    `https://api.aelf.org/v1/messes/${testDate}`,
    `https://api.aelf.org/v1/messes/${testDate}/france`,
    `https://www.aelf.org/api/v1/messes/${testDate}`,
    `https://api.aelf.org/messes/${testDate}`,
    `https://api.aelf.org/v1/informations/messe/${testDate}`,

    // Test avec aujourd'hui aussi
    `https://api.aelf.org/v1/messes/${today}`,
    `https://api.aelf.org/v1/messes/${today}/france`,
  ]

  for (const endpoint of endpoints) {
    const testResult = {
      endpoint,
      status: 0,
      success: false,
      contentType: "",
      dataStructure: {} as any,
      sampleLectures: [] as any[],
      error: "",
      responseTime: 0,
    }

    const startTime = Date.now()

    try {
      console.log(`🔍 Test: ${endpoint}`)

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json, text/html, */*",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Referer: "https://www.aelf.org/",
          "Accept-Language": "fr-FR,fr;q=0.9",
        },
        signal: AbortSignal.timeout(15000),
      })

      testResult.responseTime = Date.now() - startTime
      testResult.status = response.status
      testResult.contentType = response.headers.get("content-type") || ""

      if (response.ok) {
        if (testResult.contentType.includes("application/json")) {
          const data = await response.json()
          testResult.success = true
          testResult.dataStructure = {
            mainKeys: Object.keys(data),
            hasInformations: !!data.informations,
            hasMesses: !!data.messes,
            hasLectures: !!data.lectures,
            messesCount: data.messes?.length || 0,
          }

          // Extraire les lectures pour vérification
          if (data.messes && data.messes[0] && data.messes[0].lectures) {
            testResult.sampleLectures = data.messes[0].lectures.map((lecture: any) => ({
              type: lecture.type,
              titre: lecture.titre?.substring(0, 100),
              ref: lecture.ref,
              contenuPreview: lecture.contenu?.substring(0, 200) + "...",
            }))
          }

          if (!results.workingEndpoint) {
            results.workingEndpoint = endpoint
            results.realData = data
          }

          console.log(`✅ Succès: ${endpoint}`)
          console.log(`📊 Structure:`, testResult.dataStructure)
        } else if (testResult.contentType.includes("text/html")) {
          const html = await response.text()
          testResult.error = "HTML response - might contain embedded JSON"

          // Chercher du JSON dans le HTML
          const jsonMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({.*?});/)
          if (jsonMatch) {
            try {
              const data = JSON.parse(jsonMatch[1])
              testResult.success = true
              testResult.dataStructure = { extractedFromHTML: true, keys: Object.keys(data) }
              console.log(`✅ JSON extrait du HTML: ${endpoint}`)
            } catch (e) {
              testResult.error += " - JSON extraction failed"
            }
          }
        }
      } else {
        const errorText = await response.text()
        testResult.error = `HTTP ${response.status}: ${errorText.substring(0, 200)}`
      }
    } catch (error) {
      testResult.responseTime = Date.now() - startTime
      testResult.error = error instanceof Error ? error.message : "Unknown error"
    }

    results.tests.push(testResult)
  }

  // Test de la page AELF directe
  try {
    console.log("🔍 Test page AELF directe...")
    const pageResponse = await fetch(`https://www.aelf.org/${testDate}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(10000),
    })

    if (pageResponse.ok) {
      const html = await pageResponse.text()
      results.tests.push({
        endpoint: `https://www.aelf.org/${testDate}`,
        status: pageResponse.status,
        success: true,
        contentType: "text/html",
        note: "Page AELF accessible - scraping possible",
        htmlLength: html.length,
      })
    }
  } catch (pageError) {
    console.log("❌ Erreur page AELF:", pageError)
  }

  return NextResponse.json(results, {
    headers: {
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
