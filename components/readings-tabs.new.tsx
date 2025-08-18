"use client";

import React, { useState, useRef, useEffect } from "react";
import type { AelfReading } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReadingCard } from "@/components/reading-card";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const typeIcons: Record<string, string> = {
  'lecture_1': '📖',
  'lecture_2': '📜',
  'lecture_3': '📚',
  'lecture_4': '📚',
  'lecture_5': '📚',
  'lecture_6': '📚',
  'lecture_7': '📚',
  'epitre': '✉️',
  'evangile': '✝️',
  'psaume': '🎵',
  'cantique': '🎼',
  'alleluia': '🌟',
  'sequence': '📜'
};

const typeNames: Record<string, string> = {
  'lecture_1': 'Première Lecture',
  'lecture_2': 'Deuxième Lecture',
  'lecture_3': 'Troisième Lecture',
  'lecture_4': 'Quatrième Lecture',
  'lecture_5': 'Cinquième Lecture',
  'lecture_6': 'Sixième Lecture',
  'lecture_7': 'Septième Lecture',
  'epitre': 'Épître',
  'evangile': 'Évangile',
  'psaume': 'Psaume',
  'cantique': 'Cantique',
  'alleluia': 'Alléluia Solennel',
  'sequence': 'Séquence'
};

interface ReadingsTabsProps {
  readings: AelfReading[];
  accentColor: string;
}

export function ReadingsTabs({ readings, accentColor }: ReadingsTabsProps) {
  const [tab, setTab] = useState("0");
  const [selectedVersions, setSelectedVersions] = useState<Record<number, number>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollLeft = 0;
    }
    // Réinitialiser les versions sélectionnées quand les lectures changent
    setSelectedVersions({});
  }, [readings]);

  useEffect(() => {
    if (tab !== "0" && triggerRefs.current[parseInt(tab)]) {
      // Désactivation du défilement automatique
      // triggerRefs.current[parseInt(tab)]?.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [tab, readings]);

  const getButtonClasses = (isActive: boolean) => {
    const baseClasses = "px-3 py-1 rounded-lg font-medium flex items-center gap-1 transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-[100px] justify-between text-xs";
    return `${baseClasses} ${
      isActive 
        ? `bg-${accentColor}-500 text-white shadow-lg scale-105` 
        : `bg-white/50 dark:bg-black/20 border-${accentColor}-300 dark:border-${accentColor}-700 text-black dark:text-white`
    }`;
  };

  const renderButton = (reading: AelfReading, idx: number, onClick: () => void) => (
    <Button
      variant={tab === String(idx) ? "default" : "outline"}
      className={getButtonClasses(tab === String(idx))}
      onClick={onClick}
    >
      <span className="flex items-center gap-2">
        <span className="text-sm">
          {typeIcons[reading.type || 'lecture_1'] || '📄'}
        </span>
        <span className="text-xs">
          {typeNames[reading.type || 'lecture_1'] || 'Lecture'}
        </span>
      </span>
      {(reading.versions || reading.choix) && (
        <ChevronDown className="h-4 w-4 opacity-70" />
      )}
    </Button>
  );

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <div className="relative flex items-center">
        <TabsList
          ref={listRef}
          className={`mb-2 rounded-lg shadow bg-${accentColor}-100 dark:bg-${accentColor}-900 border border-${accentColor}-500 flex p-1 transition-all overflow-x-auto scrollbar-thin animate-navbar-tabs scrollbar-visible`}
          style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth', minWidth: 'fit-content' }}
        >
          {readings.map((reading, idx) => {
            const hasVersions = reading.versions !== undefined;
            const hasChoix = reading.choix && reading.choix.length > 0;

            if (hasVersions || hasChoix) {
              return (
                <DropdownMenu key={idx}>
                  <DropdownMenuTrigger asChild>
                    {renderButton(reading, idx, () => setTab(String(idx)))}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className={`bg-white/80 dark:bg-black/80 backdrop-blur-sm border-${accentColor}-300 dark:border-${accentColor}-700`}
                  >
                    {hasVersions ? (
                      <>
                        <DropdownMenuItem 
                          onSelect={() => {
                            setTab(String(idx));
                            setSelectedVersions(prev => ({ ...prev, [idx]: 0 }));
                          }}
                        >
                          Version longue
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onSelect={() => {
                            setTab(String(idx));
                            setSelectedVersions(prev => ({ ...prev, [idx]: 1 }));
                          }}
                        >
                          Version brève
                        </DropdownMenuItem>
                      </>
                    ) : hasChoix && reading.choix?.map((option, optionIdx) => (
                      <DropdownMenuItem
                        key={optionIdx}
                        onSelect={() => {
                          setTab(String(idx));
                          setSelectedVersions(prev => ({ ...prev, [idx]: optionIdx }));
                        }}
                      >
                        {option.titre || `Option ${optionIdx + 1}`}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <TabsTrigger
                key={idx}
                value={String(idx)}
                ref={(el: HTMLButtonElement | null) => { triggerRefs.current[idx] = el; }}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 text-black
                  data-[state=active]:bg-${accentColor}-500
                  data-[state=active]:text-white dark:data-[state=active]:text-white`}
              >
                <span>
                  {typeIcons[reading.type || 'lecture_1'] || '📄'} 
                  {typeNames[reading.type || 'lecture_1'] || 'Lecture'}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      {readings.map((reading, idx) => {
        const selectedVersion = selectedVersions[idx] || 0;
        let displayReading = { ...reading };

        if (reading.versions) {
          const version = selectedVersion === 0 ? reading.versions.longue : reading.versions.breve;
          displayReading = {
            ...reading,
            contenu: version.contenu,
            reference: version.reference,
            titre: version.titre
          };
        } else if (reading.choix && reading.choix.length > 0) {
          const choix = reading.choix[selectedVersion];
          displayReading = {
            ...reading,
            contenu: choix.contenu,
            titre: choix.titre,
            reference: choix.reference
          };
        }

        return (
          <TabsContent key={idx} value={String(idx)} className="animate-slide-in-right">
            <ReadingCard reading={displayReading} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
