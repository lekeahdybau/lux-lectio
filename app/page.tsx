"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from "react"
import "../styles/navbar-animations.css"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChevronDown, ChevronLeft, ChevronRight, RefreshCw, Share2, Heart, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ReadingCard } from "@/components/reading-card"
import { CalendarWidget } from "@/components/calendar-widget"
import { useLiturgical } from "@/components/liturgical-provider"

// Type definitions
interface Reading {
  type: string;
  reference: string;
  descriptiveTitle: string;
  excerpt: string;
  titre?: string;
  intro_lue?: string;
  contenu?: string;
  [key: string]: any;
}

interface GroupedReading {
  type: string;
  readings: Reading[];
  options?: Reading[][];
}

// Labels et emojis pour les types de lectures
const typeLabels: Record<string, string> = {
  lecture_1: '1ere Lecture',
  lecture_1_2: '1ere Lecture (brève)',
  lecture_1_3: '2e Lecture',
  lecture_1_4: '3e Lecture',
  lecture_1_5: '4e Lecture', 
  lecture_1_6: '5e Lecture',
  lecture_1_7: '7e Lecture',
  lecture_2: '2e Lecture',
  epitre: 'Épître',
  evangile: 'Évangile',
  psaume: 'Psaume',
  psaume_2: '2e Psaume',
  psaume_3: '3e Psaume', 
  psaume_4: '4e Psaume',
  cantique: 'Cantique',
  cantique_2: '2e Cantique',
  alleluia: 'Alléluia'
};

const readingEmojis: Record<string, string> = {
  lecture_1: "📖",
  lecture_1_2: "📖",
  lecture_1_3: "📖",
  lecture_1_4: "📖",
  lecture_1_5: "📖",
  lecture_1_6: "📖", 
  lecture_1_7: "📖",
  lecture_2: "📖",
  epitre: "✉️",
  evangile: "✝️",
  psaume: "🎵",
  psaume_2: "🎵",
  psaume_3: "🎵",
  psaume_4: "🎵",
  cantique: "🎼",
  cantique_2: "🎼",
  alleluia: "🌟"
};

// Fonction pour déterminer le type de lecture
const getReadingType = (reading: any, allReadings: any[]): string => {
  if (!reading) return 'lecture_1';
  
  const titre = reading.titre?.toLowerCase() || '';
  const type = reading.type?.toLowerCase() as string;
  const introLue = reading.intro_lue?.toLowerCase() || '';

  // Gestion spécifique des types AELF
  if (type === 'epitre') return 'epitre';
  if (type === 'evangile') return 'evangile';
  if (type === 'psaume') return 'psaume';
  if (type === 'cantique') return 'cantique';
  if (type === 'alleluia') return 'alleluia';
  if (type === 'lecture_1') return 'lecture_1';
  if (type === 'lecture_2') return 'lecture_2';
  
  // Détection par contenu
  if (introLue.includes('évangile') || titre.includes('évangile') || titre.includes('evangile')) return 'evangile';
  if (titre.includes('psaume') || introLue.includes('psaume')) return 'psaume';
  if (titre.includes('cantique') || introLue.includes('cantique')) return 'cantique';
  if (introLue.includes('épître') || introLue.includes('epitre') || introLue.includes('lettre')) return 'epitre';
  if (titre.includes('alléluia') || titre.includes('alleluia')) return 'alleluia';
  if (titre.includes('deuxième lecture') || titre.includes('deuxieme lecture') || introLue.includes('deuxième lecture')) return 'lecture_2';
  if (titre.includes('lecture') || introLue.includes('lecture')) return 'lecture_1';
  
  return 'lecture_1';
};

// Fonction pour normaliser les lectures
const normalizeReadings = (readings: any[]): GroupedReading[] => {
  if (!readings?.length) return [];

  const groupedMap = new Map<string, Reading[]>();

  // Première passe : regrouper par type de base (sans suffixe numérique)
  for (let i = 0; i < readings.length; i++) {
    const reading = readings[i];
    const baseType = getReadingType(reading, readings);
    const reference = reading.reference || reading.ref || "";
    let descriptiveTitle = reading.intro_lue || typeLabels[baseType] || "Lecture";

    if (reading.titre?.includes("Au choix")) {
      descriptiveTitle = reading.titre;
    }

    // Gestion spéciale pour l'épître
    if (reading.type === 'epitre') {
      descriptiveTitle = 'Épître';
    }

    const processedReading: Reading = {
      ...reading,
      type: baseType,
      reference,
      descriptiveTitle,
      excerpt: reading.titre || reading.intro_lue || "",
    };

    const group = groupedMap.get(baseType) || [];
    group.push(processedReading);
    groupedMap.set(baseType, group);
  }

  // Construire map d'options par type
  const optionsMap = new Map<string, Reading[][]>();
  groupedMap.forEach((arr, key) => {
    if (arr.length > 1) {
      optionsMap.set(key, arr.map(r => [r]));
    } else {
      optionsMap.set(key, [arr]);
    }
  });

  // Ordre exact demandé par l'utilisateur
  const desiredSequence = [
    'lecture_1', // 1ère lecture (forme longue/brève)
    'psaume',    // Psaume au choix (si plusieurs) ou simple
    'lecture_2', // 2ème lecture (forme longue/brève)
    'psaume',
    'lecture_3',
    'cantique',
    'lecture_4', // forme longue uniquement
    'psaume',
    'lecture_5',
    'cantique',
    'lecture_6',
    'psaume',
    'lecture_7',
    'psaume',
    'epitre',
    'alleluia',
    // 'alleluia_psaume' not a distinct key in data - use 'psaume' after alleluia if present
    'evangile'
  ];

  const result: Array<{ type: string; readings: Reading[]; options: Reading[][] }> = [];

  // Helper to push a type if present and not already consumed
  const pushType = (key: string) => {
    if (!optionsMap.has(key)) return;
    const opts = optionsMap.get(key)!;
    if (!opts || opts.length === 0) return;
    result.push({ type: key, readings: opts[0], options: opts });
    optionsMap.delete(key);
  };

  // Iterate desired order and push groups when present
  for (const key of desiredSequence) {
    // For 'psaume' positions, prefer to push psaume only once when it exists
    if (key === 'psaume') {
      pushType('psaume');
      continue;
    }
    pushType(key);
  }

  // Append any remaining types not covered above (fallback)
  optionsMap.forEach((opts, key) => {
    result.push({ type: key, readings: opts[0], options: opts });
  });

  return result;
};

// Composant principal
export default function HomePage() {
  const { currentDate, setCurrentDate, liturgicalData, refreshData, loading, error } = useLiturgical()
  const [messeIndex, setMesseIndex] = useState(0)
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  // Mémoize les lectures pour éviter des re-rendus inutiles
  const readings = useMemo(() => {
    // Vérification plus stricte des données
    if (!liturgicalData) return [];

    // Utilisation de l'opérateur de chaînage optionnel et de l'opérateur de coalescence nulle
    const lectures = liturgicalData.messes?.[messeIndex]?.lectures ?? 
                     Object.values(liturgicalData.lectures || {});

    return Array.isArray(lectures) ? normalizeReadings(lectures) : [];
  }, [liturgicalData, messeIndex]);

  // Logs détaillés pour le debugging
  console.log('État de l\'application:', {
    loading,
    error,
    date: currentDate.toISOString(),
    hasData: !!liturgicalData,
    readings: liturgicalData?.lectures ? Object.keys(liturgicalData.lectures).length : 0,
    messeIndex,
    couleur: liturgicalData?.informations?.couleur
  });
  
  if (error) {
    console.error('Détails de l\'erreur:', {
      message: error,
      dateRequetee: currentDate.toISOString(),
      etatDonnees: liturgicalData ? 'présentes' : 'absentes',
      lecturesDisponibles: liturgicalData?.lectures ? Object.keys(liturgicalData.lectures) : []
    });
  }

  if (liturgicalData) {
    console.log('Structure des lectures:', {
      types: Object.keys(liturgicalData.lectures || {}),
      nbMesses: liturgicalData.messes?.length || 0,
      lecturesMesseCourante: liturgicalData.messes?.[messeIndex]?.lectures?.length || 0
    });
  }

  // Couleur liturgique dynamique (par défaut violet)
  const color = (liturgicalData?.informations?.couleur as "violet"|"vert"|"rouge"|"blanc"|"rose"|"noir") || "violet"
  const bgColorMap: Record<string, string> = {
    violet: "bg-purple-100 dark:bg-purple-900",
    vert: "bg-green-100 dark:bg-green-900",
    rouge: "bg-red-100 dark:bg-red-900",
    blanc: "bg-gray-100 dark:bg-gray-900",
    rose: "bg-pink-100 dark:bg-pink-900",
    noir: "bg-black text-white",
  }
  const bgColor = bgColorMap[color] || "bg-purple-100 dark:bg-purple-900"


  const accentColor = {
    violet: "purple",
    vert: "green",
    rouge: "red",
    blanc: "zinc",
    rose: "pink",
    noir: "neutral",
  }[color] || "purple"

  if (loading) {
    return (
      <div className={`p-2 sm:p-6 max-w-3xl mx-auto min-h-screen transition-colors duration-300 ${bgColor} overflow-x-hidden`}>
        <Card className="liturgical-card">
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin mb-4" />
            <p className="text-muted-foreground">Chargement des lectures liturgiques...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-2 sm:p-6 max-w-3xl mx-auto min-h-screen transition-colors duration-300 ${bgColor} overflow-x-hidden`}>
        <Card className="liturgical-card">
          <CardContent className="p-8 text-center">
            <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
              {error.includes('API') ? 'Service AELF temporairement indisponible' : 'Erreur de chargement'}
            </p>
            <p className="text-muted-foreground mb-4">
              <span className="block mb-2">
                {error.includes('API') ? 
                  'Nous ne pouvons pas accéder aux lectures liturgiques pour le moment.' :
                  error
                }
              </span>
              <span className="text-sm text-muted-foreground">
                {error.includes('API') ? 
                  'Le service AELF est peut-être en maintenance. Veuillez réessayer dans quelques instants.' :
                  'Si le problème persiste, veuillez nous contacter.'
                }
              </span>
            </p>
            <div className="flex flex-col gap-2 items-center">
              <Button 
                onClick={refreshData} 
                variant="outline" 
                className={`hover:scale-105 transition-transform border-${accentColor}-500 text-${accentColor}-700 w-full max-w-xs`}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer maintenant
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                variant="ghost" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Recharger la page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`p-2 sm:p-6 max-w-3xl mx-auto min-h-screen transition-colors duration-300 ${bgColor} overflow-x-hidden`}>
      {/* Sidebar for Calendar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in-fast" 
          onClick={() => setSidebarOpen(false)}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-gray-50 dark:bg-gray-900 w-full max-w-sm p-4 z-50 shadow-lg animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <CalendarWidget onDateSelected={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}



      {/* Header : uniquement la sélection du type de messe si plusieurs messes */}
      {liturgicalData?.messes && liturgicalData.messes.length > 1 && (
        <div className="mb-6">
          <MesseTypeTabs
            messes={liturgicalData.messes.map((messe: any, idx: number) => ({
              ...messe,
              id: `messe-${idx}`
            }))}
            messeIndex={messeIndex}
            setMesseIndex={setMesseIndex}
            accentColor={accentColor}
          />
        </div>
      )}

      {/* Navigation horizontale pour les lectures de la messe sélectionnée (pour tous les jours) */}
      {liturgicalData?.messes && liturgicalData.messes.length > 0 ? (
        <MesseReadingsTabs
          messes={liturgicalData.messes.map((messe: any, idx: number) => ({
            ...messe,
            id: `messe-${idx}`
          }))}
          messeIndex={messeIndex}
          accentColor={accentColor}
        />
      ) : (() => {
        // Si pas de messes, on affiche les lectures globales (ordre dynamique)
        let rawReadings: any[] = []
        if (liturgicalData?.lectures && Object.keys(liturgicalData.lectures).length > 0) {
          rawReadings = Object.values(liturgicalData.lectures)
        }
        const readings = normalizeReadings(rawReadings);
        return readings.length > 0 ? (
          <ReadingsTabs readings={readings} accentColor={accentColor} />
        ) : (
          <Card className="liturgical-card">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Aucune lecture disponible pour cette date.</p>
              <p className="text-sm text-muted-foreground mt-2">
                L'API AELF pourrait être temporairement indisponible.
              </p>
              <Button onClick={refreshData} variant="outline" className={`mt-4 hover:scale-105 transition-transform border-${accentColor}-500 text-${accentColor}-700`}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </CardContent>
          </Card>
        )
      })()}
    </div>
  )
}

// Composant pour les onglets des types de messe
interface MesseTypeTabsProps {
  messes: Array<{
    id: string; 
    nom: string; 
    lectures?: any[];
  }>;
  messeIndex: number;
  setMesseIndex: (idx: number) => void;
  accentColor: string;
}

const MesseTypeTabs = memo(function MesseTypeTabs({ 
  messes, 
  messeIndex, 
  setMesseIndex, 
  accentColor 
}: MesseTypeTabsProps) {
  const messeEmojis = ["🌙", "☀️", "🕊️", "⭐", "🔥"];
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
    // Scroll to the active tab as well
    if (triggerRefs.current[messeIndex]) {
      triggerRefs.current[messeIndex]?.scrollIntoView({ 
        behavior: "smooth", 
        inline: "center", 
        block: "nearest" 
      });
    }
  }, [messeIndex, messes]);
     
  return (
    <div className="relative">
      <Tabs value={String(messeIndex)} onValueChange={(v) => setMesseIndex(Number(v))}>
        <TabsList
          ref={listRef}
          className={`rounded-lg shadow bg-${accentColor}-100 dark:bg-${accentColor}-900 border border-${accentColor}-500 flex p-1 transition-all overflow-x-scroll smooth-scroll animate-navbar-tabs`}
          style={{
            overflowX: 'scroll',
            overflowY: 'hidden',
            scrollbarWidth: 'thin',
            scrollbarColor: '#8b5cf6 #e5e7eb'
          }}
        >
          {messes.map((messe, idx) => (
            <TabsTrigger
              key={messe.id}
              value={String(idx)}
              ref={el => { triggerRefs.current[idx] = el; }}
              className={`px-2 py-1 rounded-md font-medium flex items-center gap-1 transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-[60px] text-xs
                data-[state=active]:bg-${accentColor}-500 data-[state=active]:text-white
                data-[state=active]:shadow-md data-[state=active]:scale-[1.02]
                hover:bg-${accentColor}-200 hover:text-${accentColor}-900 animate-navbar-tab`}
            >
              <span className="text-sm">{messeEmojis[idx % messeEmojis.length]}</span>
              <span className="text-xs">{messe.nom}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
});

// Composant pour les lectures d'une messe
interface MesseReadingsTabsProps {
  messes: Array<{
    id: string;
    nom: string;
    lectures?: any[];
  }>;
  messeIndex: number;
  accentColor: string;
}

const MesseReadingsTabs = memo(function MesseReadingsTabs({ 
  messes, 
  messeIndex, 
  accentColor 
}: MesseReadingsTabsProps) {
  // Vérification de l'existence de la messe
  const currentMesse = messes?.[messeIndex] ?? null;
  
  // Récupération des lectures avec une vérification de type stricte
  const rawReadings = Array.isArray(currentMesse?.lectures) 
    ? currentMesse.lectures 
    : [];
    
  const readings = useMemo(() => normalizeReadings(rawReadings), [rawReadings]);

  return (
    <div>
      <ReadingsTabs readings={readings} accentColor={accentColor} />
    </div>
  );
});

// Composant pour les onglets des lectures
interface ReadingsTabsProps {
  readings: GroupedReading[];
  accentColor: string;
}

const ReadingsTabs = memo(function ReadingsTabs({ 
  readings, 
  accentColor 
}: ReadingsTabsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  
  // Reset state when readings change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    setActiveGroupIndex(0);
    setSelectedOptions({});
  }, [readings]);
  
  // Scroll to active tab
  useEffect(() => {
    if (triggerRefs.current[activeGroupIndex]) {
      triggerRefs.current[activeGroupIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeGroupIndex]);

  const activeGroup = readings[activeGroupIndex];
  const activeOptionIndex = selectedOptions[activeGroupIndex] || 0;
  const activeReading = activeGroup?.options && activeGroup.options[activeOptionIndex] ? activeGroup.options[activeOptionIndex][0] : null;

  if (!activeReading) return null;

  return (
    <div>
      <div className="relative mb-4">
        <div
          ref={listRef}
          className="bg-transparent flex p-1 transition-all overflow-x-auto smooth-scroll no-scrollbar gap-2"
        >
          {readings.map((group, idx) => {
            const type = group.type as keyof typeof typeLabels;
            const label = {
              emoji: readingEmojis[type] || '📜',
              name: typeLabels[type] || 'Lecture'
            };
            const isActive = activeGroupIndex === idx;
            
            if (Array.isArray(group.options) && group.options.length > 1) {
              return (
                <DropdownMenu key={idx}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      ref={el => { triggerRefs.current[idx] = el; }}
                      variant={isActive ? "default" : "outline"}
                      className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1 transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-[100px] justify-between text-xs
                        ${isActive ? `bg-${accentColor}-500 text-white shadow-lg scale-105` : `bg-white/50 dark:bg-black/20 border-${accentColor}-300 dark:border-${accentColor}-700 text-black dark:text-white`}`}
                      onClick={() => setActiveGroupIndex(idx)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm">{label.emoji}</span>
                        <span className="text-xs">{label.name}</span>
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={`bg-white/80 dark:bg-black/80 backdrop-blur-sm border-${accentColor}-300 dark:border-${accentColor}-700`}>
                    {Array.isArray(group.options) ? group.options.map((option, optionIdx) => (
                      <DropdownMenuItem key={optionIdx} onSelect={() => {
                        setSelectedOptions(prev => ({ ...prev, [idx]: optionIdx }));
                        setActiveGroupIndex(idx);
                      }}>
                        {option[0]?.descriptiveTitle || `Option ${optionIdx + 1}`}
                      </DropdownMenuItem>
                    )) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <button
                key={idx}
                ref={el => { triggerRefs.current[idx] = el; }}
                onClick={() => setActiveGroupIndex(idx)}
                className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1 transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-[90px] text-xs
                  ${isActive ? `bg-${accentColor}-500 text-white shadow-lg scale-105` : `bg-white/50 dark:bg-black/20 border border-transparent text-black dark:text-white`}`}
              >
                <span className="text-sm">{label.emoji}</span>
                <span className="text-xs">{label.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="animate-slide-in-right">
        <ReadingCard
          // ReadingCard accepts Partial<AelfReading> so we can safely pass runtime data
          reading={activeReading}
          className="animate-slide-in-right"
        />
      </div>
    </div>
  );
});
