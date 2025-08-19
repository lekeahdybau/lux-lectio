"use client"

import React, { useState, useEffect } from "react"
import "../styles/navbar-animations.css"
import { ChevronLeft, ChevronRight, RefreshCw, Share2, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalendarWidget } from "@/components/calendar-widget"
import { ReadingsTabs } from "@/components/readings-tabs"
import { useLiturgical } from "@/components/liturgical-provider"

interface PageState {
  showCalendar: boolean;
}

// Animation des titres
function SlidingLiturgicalTitle({ liturgicalInfo }: { liturgicalInfo: any }) {
  const defaultTitle = "Chargement...";
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation on info change
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [liturgicalInfo]);

  if (!liturgicalInfo) {
    return <h1 className="text-2xl font-bold mb-4">{defaultTitle}</h1>;
  }

  const { ligne1, ligne2, ligne3 } = liturgicalInfo;

  return (
    <div key={animationKey} className="space-y-1">
      {ligne1 && (
        <h1 className="animate-title-slide-1 font-bold text-xl md:text-2xl opacity-0">
          {ligne1}
        </h1>
      )}
      {ligne2 && (
        <h2 className="animate-title-slide-2 font-semibold text-lg md:text-xl opacity-0">
          {ligne2}
        </h2>
      )}
      {ligne3 && (
        <h3 className="animate-title-slide-3 text-muted-foreground font-medium text-base md:text-lg opacity-0">
          {ligne3}
        </h3>
      )}
    </div>
  );
}

// Convertir une date en format français
function formatDateFr(date: Date) {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('fr-FR', options);
}

// Composant principal de la page
export default function Home() {
  const { state: liturgicalState, dispatch: liturgicalDispatch } = useLiturgical();
  
  // États locaux
  const [pageState, setPageState] = useState<PageState>({
    showCalendar: false
  });

  const toggleCalendar = () => {
    setPageState(prev => ({
      ...prev,
      showCalendar: !prev.showCalendar
    }));
  };

  // Gérer le changement de date
  const handleDateChange = (newDate: string) => {
    liturgicalDispatch({ type: "SET_DATE", payload: newDate });
    setPageState(prev => ({
      ...prev,
      showCalendar: false
    }));
  };

  // Navigation entre les dates
  const navigateDate = (direction: 'prev' | 'next') => {
    if (!liturgicalState.currentDate) return;
    
    const currentDate = new Date(liturgicalState.currentDate);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    handleDateChange(newDate.toISOString().split('T')[0]);
  };

  // Partager la lecture actuelle
  const shareCurrentReading = async () => {
    if (!liturgicalState.currentDate || !liturgicalState.data) {
      return;
    }

    try {
      const date = new Date(liturgicalState.currentDate);
      const formattedDate = formatDateFr(date);
      
      const shareData = {
        title: 'Lectures du jour',
        text: `Lectures du ${formattedDate}\n\n`,
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text + shareData.url);
        // TODO: Show toast notification
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Si pas de données, afficher un placeholder
  if (!liturgicalState.data) {
    return (
      <main className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary rounded w-2/3 mb-4"></div>
          <div className="h-6 bg-secondary rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-secondary rounded w-1/3"></div>
        </div>
      </main>
    );
  }

  // Extraire les informations liturgiques
  const { informations } = liturgicalState.data;

  return (
    <main className="container max-w-6xl mx-auto">
      {/* En-tête avec la date et les commandes */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur px-4 pt-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          {/* Contrôles de date */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate('prev')}
              title="Jour précédent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={toggleCalendar}
              className="gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              {formatDateFr(new Date(liturgicalState.currentDate))}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate('next')}
              title="Jour suivant"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => liturgicalDispatch({ type: "REFRESH" })}
              title="Rafraîchir"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={shareCurrentReading}
              title="Partager"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Informations liturgiques */}
        <div className="mb-4">
          <SlidingLiturgicalTitle liturgicalInfo={informations} />
        </div>
      </div>

      {/* Calendrier */}
      {pageState.showCalendar && (
        <div className="px-4 mb-4">
          <CalendarWidget 
            selectedDate={liturgicalState.currentDate}
            onSelect={handleDateChange}
          />
        </div>
      )}

      {/* Contenu principal */}
      <div className="px-4">
        <ReadingsTabs 
          date={liturgicalState.currentDate}
        />
      </div>
    </main>
  );
}
