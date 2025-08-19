"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import "../styles/navbar-animations.css"
import { ChevronLeft, ChevronRight, RefreshCw, Share2, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalendarWidget } from "@/components/calendar-widget"
import { ReadingsTabs } from "@/components/readings-tabs.new"
import { useLiturgical } from "@/components/liturgical-provider"
import type { AelfData } from "@/lib/api"

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

// Loading component
function LoadingPlaceholder() {
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

// Composant principal de la page
export default function Home() {
  const liturgical = useLiturgical();
  const [mounted, setMounted] = useState(false);
  
  // États locaux
  const [pageState, setPageState] = useState<PageState>({
    showCalendar: false
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleCalendar = () => {
    setPageState(prev => ({
      ...prev,
      showCalendar: !prev.showCalendar
    }));
  };

  // Gérer le changement de date
  const handleDateChange = (newDate: Date) => {
    liturgical.setCurrentDate(newDate);
    setPageState(prev => ({
      ...prev,
      showCalendar: false
    }));
  };

  // Navigation entre les dates
  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = liturgical.currentDate;
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    handleDateChange(newDate);
  };

  // Partager la lecture actuelle
  const shareCurrentReading = async () => {
    if (!mounted || !liturgical.liturgicalData) {
      return;
    }

    try {
      const formattedDate = formatDateFr(liturgical.currentDate);
      
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

  // Loading state
  if (!mounted || liturgical.loading) {
    return <LoadingPlaceholder />;
  }

  // Error state
  if (liturgical.error) {
    return (
      <main className="container mx-auto p-4">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <h1 className="text-lg font-semibold mb-2">Erreur</h1>
          <p>{liturgical.error}</p>
          <Button 
            variant="outline" 
            onClick={liturgical.refreshData}
            className="mt-4"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        </div>
      </main>
    );
  }

  // Extraire les informations liturgiques
  const informations = liturgical.liturgicalData?.informations;

  return (
    <main className="container max-w-6xl mx-auto">
      <div className="px-4">
        {(liturgical.liturgicalData && Array.isArray(liturgical.liturgicalData.messes) && liturgical.liturgicalData.messes.length > 1) ? (
          <Tabs defaultValue={"messe-0"} className="w-full">
            <TabsList className="mb-4">
              {liturgical.liturgicalData.messes.map((messe, idx) => (
                <TabsTrigger key={idx} value={`messe-${idx}`}>{messe.nom || `Messe ${idx + 1}`}</TabsTrigger>
              ))}
            </TabsList>
            {liturgical.liturgicalData.messes.map((messe, idx) => (
              <TabsContent key={idx} value={`messe-${idx}`} className="mt-4">
                <ReadingsTabs 
                  readings={messe.lectures || []}
                  accentColor={liturgical.liturgicalColor || "vert"}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <ReadingsTabs 
            readings={liturgical.liturgicalData?.messes?.[0]?.lectures || []}
            accentColor={liturgical.liturgicalColor || "vert"}
          />
        )}
      </div>
    </main>
  );
}
