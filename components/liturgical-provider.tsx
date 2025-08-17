"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { fetchLiturgicalReadings, type AelfData } from "@/lib/api"

interface LiturgicalContextType {
  currentDate: Date
  liturgicalData: AelfData | null
  liturgicalColor: string
  loading: boolean
  error: string | null
  setCurrentDate: (date: Date) => void
  refreshData: () => void
}

const LiturgicalContext = createContext<LiturgicalContextType | undefined>(undefined)

export function LiturgicalProvider({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [liturgicalData, setLiturgicalData] = useState<AelfData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const liturgicalColor = liturgicalData?.informations?.couleur || "vert"

  const fetchLiturgicalData = async (date: Date) => {
    setLoading(true)
    setError(null)

    try {
      // Correction : toujours envoyer la date locale (minuit local) à l’API, sans décalage UTC
      const dateStr = date.toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' })
      console.log("Chargement des données liturgiques pour:", dateStr)

      const data = await fetchLiturgicalReadings(dateStr)
      console.log("Données brutes de l'API:", data);
      setLiturgicalData(data)
    } catch (err) {
      console.error("Erreur lors du chargement des données AELF:", err)
      setError("Impossible de charger les données liturgiques. Vérifiez votre connexion internet.")
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    fetchLiturgicalData(currentDate)
  }

  useEffect(() => {
    fetchLiturgicalData(currentDate)
  }, [currentDate])

  // Application des couleurs liturgiques au CSS
  useEffect(() => {
    const root = document.documentElement

    // Supprimer les anciennes classes liturgiques
    root.classList.remove(
      "liturgical-vert",
      "liturgical-violet",
      "liturgical-rouge",
      "liturgical-blanc",
      "liturgical-rose",
      "liturgical-noir",
    )

    // Ajouter la nouvelle classe liturgique
    root.classList.add(`liturgical-${liturgicalColor}`)

    console.log("Couleur liturgique appliquée:", liturgicalColor)
  }, [liturgicalColor])

  return (
    <LiturgicalContext.Provider
      value={{
        currentDate,
        liturgicalData,
        liturgicalColor,
        loading,
        error,
        setCurrentDate,
        refreshData,
      }}
    >
      {children}
    </LiturgicalContext.Provider>
  )
}

export function useLiturgical() {
  const context = useContext(LiturgicalContext)
  if (context === undefined) {
    throw new Error("useLiturgical must be used within a LiturgicalProvider")
  }
  return context
}
