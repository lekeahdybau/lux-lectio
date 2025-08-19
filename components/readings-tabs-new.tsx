"use client";

import React, { useState, useEffect, memo } from "react";
import { ReadingCard } from "@/components/reading-card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { AelfReading } from "@/lib/api";

interface GroupedReading {
  type: string;
  reading: AelfReading;
}

interface ReadingsTabsProps {
  date?: string;
  readings?: GroupedReading[];
  accentColor?: string;
}

const typeLabels: Record<string, string> = {
  lecture_1: '1ère Lecture',
  lecture_2: '2e Lecture',
  epitre: 'Épître',
  evangile: 'Évangile',
  psaume: 'Psaume',
  cantique: 'Cantique',
};

const readingEmojis: Record<string, string> = {
  lecture_1: "📖",
  lecture_2: "📖",
  epitre: "✉️",
  evangile: "✝️",
  psaume: "🎵",
  cantique: "🎼",
};

const LoadingSpinner = () => (
  <div className="animate-spin">
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
  </div>
);

export const ReadingsTabs = memo(function ReadingsTabs({ date, readings: initialReadings, accentColor = "bg-primary" }: ReadingsTabsProps) {
  const [activeReading, setActiveReading] = useState<string | null>(null);
  const [readings, setReadings] = useState<GroupedReading[]>(initialReadings || []);
  const [loading, setLoading] = useState(!initialReadings);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialReadings) {
      fetchReadings();
    }
  }, [date, initialReadings]);

  const fetchReadings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/aelf?date=${date || new Date().toISOString().split('T')[0]}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des lectures');
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.message || 'Erreur lors de la récupération des données');
      }

      // Transformer les lectures en format GroupedReading
      const formattedReadings: GroupedReading[] = Object.entries(data.lectures)
        .filter(([_, reading]) => reading && typeof reading === 'object')
        .map(([type, reading]) => ({
          type,
          reading: reading as AelfReading
        }));

      setReadings(formattedReadings);
      if (formattedReadings.length > 0 && !activeReading) {
        setActiveReading(formattedReadings[0].type);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const currentReading = activeReading 
    ? readings.find(r => r.type === activeReading)?.reading 
    : readings[0]?.reading;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erreur de chargement</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>Impossible de charger les données liturgiques. Vérifiez votre connexion internet.</p>
          <p>Si le problème persiste, veuillez nous contacter.</p>
          <Button onClick={fetchReadings} variant="outline" className="mt-4 gap-2">
            <LoadingSpinner />
            Réessayer maintenant
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!readings || readings.length === 0) {
    return (
      <Alert>
        <AlertTitle>Aucune lecture disponible</AlertTitle>
        <AlertDescription>
          Aucune lecture n&apos;est disponible pour cette date.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2">
        {readings.map(({ type, reading }) => (
          <Button
            key={type}
            variant={activeReading === type ? "default" : "outline"}
            className={`${activeReading === type ? accentColor : ''}`}
            onClick={() => setActiveReading(type)}
          >
            <span className="mr-2">{readingEmojis[type] || "📑"}</span>
            {typeLabels[type] || type}
          </Button>
        ))}
      </div>

      {currentReading && (
        <ReadingCard 
          reading={currentReading}
        />
      )}
    </div>
  );
});
