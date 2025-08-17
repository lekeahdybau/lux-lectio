"use client"

import { useState, useEffect } from "react"
import { Palette, Bell, Download, Shield, Globe, Volume2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"

interface UserSettings {
  notifications: boolean
  autoDownload: boolean
  fontSize: number
  language: string
  displayMode: "all" | "prayer" | "reading"
  soundEnabled: boolean
  volume: number
  offlineMode: boolean
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
    autoDownload: false,
    fontSize: 16,
    language: "fr",
    displayMode: "all",
    soundEnabled: true,
    volume: 50,
    offlineMode: false,
  })

  const [storageUsed, setStorageUsed] = useState(0)

  useEffect(() => {
    // Charger les paramètres sauvegardés
    const savedSettings = localStorage.getItem("lux-lectio-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Calculer l'espace de stockage utilisé
    let totalSize = 0
    for (const key in localStorage) {
      if (key.startsWith("lux-lectio-")) {
        totalSize += localStorage[key].length
      }
    }
    setStorageUsed(Math.round(totalSize / 1024)) // en KB
  }, [])

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("lux-lectio-settings", JSON.stringify(newSettings))
  }

  const clearCache = () => {
    const keys = Object.keys(localStorage).filter(
      (key) => key.startsWith("lux-lectio-data-") || key.startsWith("lux-lectio-spiritual-"),
    )
    keys.forEach((key) => localStorage.removeItem(key))
    setStorageUsed(0)
  }

  const exportData = () => {
    const data = {
      settings,
      favorites: localStorage.getItem("lux-lectio-favorites"),
      bookmarks: localStorage.getItem("bible-bookmarks"),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "lux-lectio-backup.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 animate-slide-in-right">
        <h1 className="text-3xl font-bold text-liturgical-primary mb-2">Paramètres</h1>
        <p className="text-muted-foreground">Personnalisez votre expérience spirituelle</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Apparence */}
        <Card className="liturgical-card hover-lift animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center text-liturgical-primary">
              <Palette className="h-5 w-5 mr-2" />
              Apparence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Thème</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un thème" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Taille de police: {settings.fontSize}px</Label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting("fontSize", value)}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Mode d'affichage</Label>
              <Select value={settings.displayMode} onValueChange={(value: any) => updateSetting("displayMode", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tout afficher</SelectItem>
                  <SelectItem value="prayer">Prière seule</SelectItem>
                  <SelectItem value="reading">Lecture seule</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="liturgical-card hover-lift animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center text-liturgical-primary">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rappels quotidiens</Label>
                <p className="text-sm text-muted-foreground">Recevoir des rappels pour les offices et lectures</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSetting("notifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Téléchargement automatique</Label>
                <p className="text-sm text-muted-foreground">Télécharger les contenus pour le mode hors ligne</p>
              </div>
              <Switch
                checked={settings.autoDownload}
                onCheckedChange={(checked) => updateSetting("autoDownload", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode hors ligne</Label>
                <p className="text-sm text-muted-foreground">Utiliser les contenus téléchargés sans internet</p>
              </div>
              <Switch
                checked={settings.offlineMode}
                onCheckedChange={(checked) => updateSetting("offlineMode", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Audio */}
        <Card className="liturgical-card hover-lift animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center text-liturgical-primary">
              <Volume2 className="h-5 w-5 mr-2" />
              Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sons activés</Label>
                <p className="text-sm text-muted-foreground">Activer les sons pour les notifications et interactions</p>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Volume: {settings.volume}%</Label>
              <Slider
                value={[settings.volume]}
                onValueChange={([value]) => updateSetting("volume", value)}
                min={0}
                max={100}
                step={5}
                className="w-full"
                disabled={!settings.soundEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Langue et région */}
        <Card className="liturgical-card hover-lift animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center text-liturgical-primary">
              <Globe className="h-5 w-5 mr-2" />
              Langue et région
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Langue</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-liturgical-bg rounded-lg">
              <p className="text-sm text-liturgical-text">
                <strong>Note:</strong> Les textes liturgiques sont fournis en français selon la liturgie catholique
                romaine.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stockage et données */}
        <Card className="liturgical-card hover-lift animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center text-liturgical-primary">
              <Download className="h-5 w-5 mr-2" />
              Stockage et données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Espace utilisé</Label>
                <span className="text-sm text-muted-foreground">{storageUsed} KB</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-liturgical-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((storageUsed / 1000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="outline" onClick={clearCache} className="w-full hover-lift">
                Vider le cache
              </Button>
              <Button variant="outline" onClick={exportData} className="w-full hover-lift">
                Exporter mes données
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sécurité et confidentialité */}
        <Card className="liturgical-card hover-lift animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center text-liturgical-primary">
              <Shield className="h-5 w-5 mr-2" />
              Confidentialité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-liturgical-bg rounded-lg">
                <h4 className="font-semibold text-liturgical-text mb-2">Respect de votre vie privée</h4>
                <p className="text-sm text-muted-foreground">
                  Lux Lectio respecte votre vie privée. Toutes vos données sont stockées localement sur votre appareil.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Données collectées :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Préférences d'affichage</li>
                  <li>• Favoris et signets</li>
                  <li>• Historique de lecture (local)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Données NON collectées :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Informations personnelles</li>
                  <li>• Données de géolocalisation</li>
                  <li>• Historique de navigation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions globales */}
      <Card className="liturgical-card hover-lift mt-6 animate-scale-in">
        <CardHeader>
          <CardTitle className="text-liturgical-primary">Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => window.location.reload()} className="hover-lift">
              Actualiser l'application
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?")) {
                  localStorage.removeItem("lux-lectio-settings")
                  window.location.reload()
                }
              }}
              className="hover-lift"
            >
              Réinitialiser les paramètres
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
