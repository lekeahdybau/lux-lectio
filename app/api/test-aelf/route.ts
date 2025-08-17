import { NextResponse } from "next/server"

// Route de test pour diagnostiquer l'API AELF
export async function GET() {
  const testDate = "2024-01-10"
  const testEndpoints = [
    `https://api.aelf.org/v1/messes/${testDate}/france`,
    `https://api.aelf.org/v1/messes/${testDate}`,
    `https://api.aelf.org/messes/${testDate}/france`,
    `https://api.aelf.org/messes/${testDate}`,
    `https://www.aelf.org/api/v1/messes/${testDate}`,
    `https://www.aelf.org/api/messes/${testDate}`,
  ]

  const results = []

  for (const endpoint of testEndpoints) {
    try {
      console.log(`Test de l'endpoint: ${endpoint}`)

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "LuxLectio/1.0 Test",
        },
      })

      const result = {
        endpoint,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        success: response.ok,
      }

      if (response.ok) {
        try {
          const data = await response.json()
          result.data = data
          result.dataKeys = Object.keys(data)
        } catch (jsonError) {
          result.jsonError = "Impossible de parser le JSON"
          result.rawText = await response.text()
        }
      } else {
        try {
          result.errorText = await response.text()
        } catch (e) {
          result.errorText = "Impossible de lire la réponse d'erreur"
        }
      }

      results.push(result)
    } catch (error) {
      results.push({
        endpoint,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        success: false,
      })
    }
  }

  return NextResponse.json({
    message: "Test des endpoints AELF",
    testDate,
    results,
    summary: {
      total: testEndpoints.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    },
  })
}
