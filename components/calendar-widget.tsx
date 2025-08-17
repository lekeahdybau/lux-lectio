"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLiturgical } from "@/components/liturgical-provider"
import { cn } from "@/lib/utils"

export function CalendarWidget({ onDateSelected }: { onDateSelected?: (date: Date) => void }) {
  const { currentDate, setCurrentDate } = useLiturgical()
  const [viewDate, setViewDate] = useState(new Date(currentDate))

  const today = new Date()
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(viewDate)
    newDate.setMonth(month + (direction === "next" ? 1 : -1))
    setViewDate(newDate)
  }

  const selectDate = (day: number) => {
    const selectedDate = new Date(year, month, day)
    setCurrentDate(selectedDate)
    if (onDateSelected) onDateSelected(selectedDate)
  }

  const isToday = (day: number) => {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
  }

  const isSelected = (day: number) => {
    return currentDate.getFullYear() === year && currentDate.getMonth() === month && currentDate.getDate() === day
  }

  // Générer les jours du calendrier
  const calendarDays = []

  // Jours vides au début
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <Card className="liturgical-card hover-lift">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-liturgical-primary">
            {monthNames[month]} {year}
          </CardTitle>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth("prev")} className="h-8 w-8 hover-glow">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth("next")} className="h-8 w-8 hover-glow">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-liturgical-text p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div key={index} className="aspect-square">
              {day && (
                <button
                  onClick={() => selectDate(day)}
                  className={cn(
                    "w-full h-full flex items-center justify-center rounded-md text-sm transition-colors",
                    isSelected(day) && "bg-liturgical-primary text-white",
                    isToday(day) && !isSelected(day) && "ring-1 ring-liturgical-primary",
                    !isSelected(day) && "hover:bg-liturgical-primary/10",
                  )}
                >
                  {day}
                </button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
