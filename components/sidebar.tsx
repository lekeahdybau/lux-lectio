"use client"


import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Clock, BookOpen, User, Info, Settings, Heart, Menu, X, Calendar, Cross, Sun, Moon, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { CalendarWidget } from "./calendar-widget"
import { Button } from "@/components/ui/button"
import { useLiturgical } from "@/components/liturgical-provider"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"


// Navigation items (à adapter selon vos routes réelles)
const navigation = [
  { name: "Messes", href: "/", icon: BookOpen },
  { name: "Offices", href: "/offices", icon: Clock },
  { name: "Bible", href: "/bible", icon: Book },
  { name: "Saints", href: "/saints", icon: User },
  { name: "À propos", href: "/about", icon: Info },
  { name: "Paramètres", href: "/settings", icon: Settings },
  { name: "Support", href: "/support", icon: Heart },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const { setCurrentDate, refreshData } = useLiturgical()
  const pathname = usePathname()
  const { liturgicalData, liturgicalColor } = useLiturgical()
  const { theme, setTheme } = useTheme()

  const { currentDate } = useLiturgical()
  const formatLiturgicalDate = (date: Date) =>
    date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
  
  const changeDate = (days: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + days)
    setCurrentDate(newDate)
  }

  const getLiturgicalColorName = (color: string) => {
    const colorNames: Record<string, string> = {
      vert: "Temps ordinaire",
      violet: "Avent / Carême",
      rouge: "Martyrs / Pentecôte",
      blanc: "Fêtes du Seigneur",
      rose: "Joie tempérée",
      noir: "Deuil",
    }
    return colorNames[color] || "Temps ordinaire"
  }

  const getLogoColor = (color: string) => {
    switch (color) {
      case "vert": return "text-green-500"
      case "violet": return "text-purple-500"
      case "rouge": return "text-red-500"
      case "blanc": return "text-sky-500"
      case "rose": return "text-pink-500"
      case "noir": return "text-gray-500"
      default: return "text-green-500"
    }
  }

  return (
    <>
      {/* Bouton menu mobile */}
        <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-sky-100/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg hover-lift"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Ouvrir le menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col bg-sky-100/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-liturgical-primary/20 shadow-2xl">
          {/* En-tête avec logo et titre uniquement */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600" />
            <div className="relative p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3 animate-float">
                  <Cross className={`h-10 w-10 mr-3 drop-shadow-lg ${getLogoColor(liturgicalColor)}`} />
                  <h1 className={`text-2xl font-bold drop-shadow-lg ${getLogoColor(liturgicalColor)}`}>Lux Lectio</h1>
                </div>
                <p className="text-sm opacity-90 drop-shadow text-gray-600 dark:text-gray-300">Compagnon liturgique</p>
                <div className="mt-3 flex items-center justify-center space-x-2">
                  {[0, 0.2, 0.4].map((delay) => (
                    <div
                      key={delay}
                      className={`w-2 h-2 rounded-full animate-pulse ${getLogoColor(liturgicalColor).replace("text-", "bg-")}`}
                      style={{ animationDelay: `${delay}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section Calendrier et Informations liturgiques regroupées */}
          <div className="p-4 border-b border-liturgical-primary/20 liturgical-card mx-4 my-2 rounded-xl animate-slide-in-right">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => changeDate(-1)}
                  className="h-8 w-8 p-0 hover:bg-liturgical-primary/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCalendar((v) => !v)}
                  className="px-3 py-1 h-8 text-xs hover:bg-liturgical-primary/10"
                >
                  <Calendar className="h-3 w-3 mr-2" />
                  {currentDate.toLocaleDateString('fr-FR', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => changeDate(1)}
                  className="h-8 w-8 p-0 hover:bg-liturgical-primary/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-6 w-6 hover-glow"
                  aria-label="Changer le thème"
                >
                  {theme === "dark" ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={refreshData}
                  className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Actualiser"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Calendrier affiché si showCalendar */}
            {showCalendar && (
              <div className="mb-4 animate-scale-in">
                <CalendarWidget
                  onDateSelected={(date) => {
                    setCurrentDate(date)
                    setShowCalendar(false)
                  }}
                />
              </div>
            )}

            {/* Informations liturgiques */}
            {liturgicalData && (
              <div>
                <h3 className="text-sm font-semibold text-liturgical-primary mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Liturgie du jour
                </h3>
                
                {/* Date liturgique formatée */}
                <div className="mb-3 p-3 bg-gradient-to-r from-sky-50 to-sky-100 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-sky-200 dark:border-slate-600">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {formatLiturgicalDate(currentDate)}
                  </p>
                  {liturgicalData.informations.semaine && (
                    <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">
                      {liturgicalData.informations.semaine}
                    </p>
                  )}
                </div>

                {/* Nom liturgique du jour */}
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 leading-relaxed">
                  {liturgicalData.informations.jour_liturgique_nom?.replace(/\bde la férie\s+de la férie\b/gi, 'de la férie') || 'Jour ordinaire'}
                </p>
                
                {/* Fête ou Saint du jour */}
                {liturgicalData.informations.fete && (
                  <div className="mb-3 p-2 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-amber-800 dark:text-amber-200 font-medium flex items-center gap-1">
                      <span className="text-sm">✨</span>
                      {liturgicalData.informations.fete.replace(/\bde la férie\s+de la férie\b/gi, 'de la férie')}
                    </p>
                  </div>
                )}
                
                {/* Temps liturgique */}
                {liturgicalData.informations.temps_liturgique && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 italic capitalize">
                    Temps {liturgicalData.informations.temps_liturgique}
                  </p>
                )}
                
                {/* Couleur liturgique */}
                <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-600">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full mr-2 shadow-lg animate-pulse-glow",
                        liturgicalColor === "vert" && "bg-green-500",
                        liturgicalColor === "violet" && "bg-purple-500",
                        liturgicalColor === "rouge" && "bg-red-500",
                        liturgicalColor === "blanc" && "bg-sky-500",
                        liturgicalColor === "rose" && "bg-pink-500",
                        liturgicalColor === "noir" && "bg-gray-500",
                      )}
                    />
                    <span className="text-xs capitalize text-liturgical-text font-medium">
                      {getLiturgicalColorName(liturgicalColor)}
                    </span>
                  </div>
                  {/* Nombre de messes disponibles */}
                  {liturgicalData.messes && liturgicalData.messes.length > 1 && (
                    <span className="text-xs bg-liturgical-primary/20 text-liturgical-primary px-2 py-1 rounded-full font-medium">
                      {liturgicalData.messes.length} messes
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {/* Lectures disponibles section */}
            {liturgicalData && liturgicalData.messes && liturgicalData.messes.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-liturgical-primary mb-2 uppercase tracking-wider opacity-75">Lectures disponibles</h4>
                <div className="space-y-1">
                  {liturgicalData.messes.map((messe, idx) => (
                    <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 p-2 rounded-lg bg-white/30 dark:bg-slate-800/30">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 bg-liturgical-primary rounded-full"></span>
                        <span className="font-medium">{messe.nom}</span>
                      </div>
                      {messe.lectures && messe.lectures.length > 0 && (
                        <div className="ml-4 space-y-1">
                          {messe.lectures.slice(0, 4).map((lecture, lectureIdx) => (
                            <div key={lectureIdx} className="flex items-center gap-1 text-xs opacity-75">
                              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                              <span className="truncate">
                                {lecture.titre || lecture.type || `Lecture ${lectureIdx + 1}`}
                              </span>
                            </div>
                          ))}
                          {messe.lectures.length > 4 && (
                            <div className="text-xs text-liturgical-primary opacity-60 ml-3">
                              +{messe.lectures.length - 4} autres...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Navigation principale */}
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover-lift group",
                    isActive
                      ? "bg-liturgical-primary text-white shadow-lg animate-pulse-glow"
                      : "text-gray-700 dark:text-gray-300 hover:bg-liturgical-primary/10 hover:text-liturgical-primary",
                  )}
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${(index + 5) * 0.1}s` }}
                >
                  <item.icon className={cn("h-5 w-5 mr-3 transition-transform duration-300", "group-hover:scale-110")} />
                  {item.name}
                  {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-liturgical-primary/20">
            <div className="liturgical-card p-3 rounded-xl text-center animate-slide-in-left">
              <p className="text-xs text-liturgical-text">
                Développé avec ❤️ par<br />
                <span className="font-semibold text-liturgical-primary">AHOUFACK Dylanne Baudouin</span><br />
                <span className="text-xs opacity-75">Ing. Génie Logiciel</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden animate-scale-in"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
