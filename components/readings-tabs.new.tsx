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
  'lecture_2': '📖',
  'lecture_3': '📖',
  'lecture_4': '📖',
  'lecture_5': '📖',
  'lecture_6': '📖',
  'lecture_7': '📖',
  'epitre': '📖',
  'evangile': '📖',
  'psaume': '🎵',
  'cantique': '🎼',
  'alleluia': '🌟',
  'sequence': '🎵'
};

const typeNames: Record<string, string> = {
  'lecture_1': '1ère Lecture',
  'lecture_2': '2e Lecture',
  'lecture_3': '3e Lecture',
  'lecture_4': '4e Lecture',
  'lecture_5': '5e Lecture',
  'lecture_6': '6e Lecture',
  'lecture_7': '7e Lecture',
  'epitre': 'Épître',
  'evangile': 'Évangile',
  'psaume': 'Psaume',
  'cantique': 'Cantique',
  'alleluia': 'Alléluia',
  'sequence': 'Séquence'
};

interface ReadingsTabsProps {
  readings: AelfReading[];
  accentColor: string;
}

type ReadingGroup = {
  type: string;
  options: AelfReading[];
};

// Fonction pour normaliser les lectures et éviter les doublons
function normalizeReadings(readings: AelfReading[]): AelfReading[] {
  // Regrouper lectures et leurs psaumes/cantiques/séquences associés
  // Regroupement des lectures/psaumes/évangiles consécutifs du même type
  const result: any[] = [];
  const used = new Set();
  const lectureTypes = [
    'lecture_1', 'lecture_2', 'lecture_3', 'lecture_4', 'lecture_5', 'lecture_6', 'lecture_7', 'epitre', 'evangile'
  ];
  let psaumeAfter7 = false;
  let stop = false;
  let i = 0;
  while (i < readings.length && !stop) {
    if (used.has(i)) { i++; continue; }
    const reading = readings[i];
    if (lectureTypes.includes(reading.type || '') || ['psaume', 'cantique', 'sequence', 'alleluia'].includes(reading.type || '')) {
      // Regrouper les lectures/psaumes/évangiles consécutifs du même type
      const group = [reading];
      used.add(i);
      let j = i + 1;
      while (j < readings.length && readings[j].type === reading.type) {
        group.push(readings[j]);
        used.add(j);
        j++;
      }
      // Cas évangile : stop après
      if (reading.type === 'evangile') stop = true;
      // Cas lecture_7 : un seul psaume après
      if (reading.type === 'lecture_7') {
        let k = j;
        while (k < readings.length && readings[k].type === 'psaume') {
          if (!psaumeAfter7) {
            group.push(readings[k]);
            used.add(k);
            psaumeAfter7 = true;
          }
          k++;
        }
        i = k;
      } else {
        i = j;
      }
      result.push(group.length > 1 ? { type: reading.type, options: group } : group[0]);
    } else {
      i++;
    }
  }
  return result;
}

export function ReadingsTabs({ readings, accentColor }: ReadingsTabsProps) {
  const [tab, setTab] = useState("0");
  const [selectedVersions, setSelectedVersions] = useState<Record<number, number>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Normaliser les lectures
  const normalizedReadings: (AelfReading | ReadingGroup)[] = normalizeReadings(readings);

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
    const baseClasses = "px-3 py-1 rounded-lg font-medium flex items-center gap-1 transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-[115px] max-w-[115px] justify-between text-xs";
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
        <span className="text-sm" style={{ fontFamily: 'Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif' }}>
          {reading.type === 'sequence' ? typeIcons['sequence'] : typeIcons[reading.type || 'lecture_1']}
        </span>
        <span className="text-xs">
          {reading.type === 'sequence' ? 'Séquence' : typeNames[reading.type || 'lecture_1'] || 'Lecture'}
        </span>
        {/* Flèche visible si menu déroulant */}
        <ChevronDown className="h-4 w-4 opacity-70 ml-1" />
      </span>
    </Button>
  );

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <div className="w-full overflow-x-auto scrollbar-thin no-scrollbar" style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}>
        <TabsList
          ref={listRef}
          className={`flex flex-row gap-2 mb-2 rounded-lg shadow bg-${accentColor}-100 dark:bg-${accentColor}-900 border border-${accentColor}-500 p-1 min-w-max animate-navbar-tabs`}
          style={{ minWidth: 'max-content' }}
        >
          {normalizedReadings.map((item, idx) => {
            // Cas groupe (plusieurs lectures/psaumes/evangiles au choix)
            if ('options' in item) {
              return (
                <DropdownMenu key={idx}>
                  <DropdownMenuTrigger asChild>
                    {renderButton(item.options[0], idx, () => setTab(String(idx)))}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {item.options.map((option: AelfReading, optionIdx: number) => {
                      // Si versions longue/brève
                      if (option.versions) {
                        return [
                          <DropdownMenuItem
                            key={optionIdx + '-longue'}
                            onSelect={() => {
                              setTab(String(idx));
                              setSelectedVersions(prev => ({ ...prev, [idx]: 0 }));
                            }}
                          >
                            Version longue {option.versions.longue.titre ? `- ${option.versions.longue.titre}` : ''} {option.versions.longue.reference ? option.versions.longue.reference : ''}
                          </DropdownMenuItem>,
                          <DropdownMenuItem
                            key={optionIdx + '-breve'}
                            onSelect={() => {
                              setTab(String(idx));
                              setSelectedVersions(prev => ({ ...prev, [idx]: 1 }));
                            }}
                          >
                            Version brève {option.versions.breve.titre ? `- ${option.versions.breve.titre}` : ''} {option.versions.breve.reference ? option.versions.breve.reference : ''}
                          </DropdownMenuItem>
                        ];
                      }
                      // Si choix
                      if (option.choix && option.choix.length > 0) {
                        return option.choix.map((choix, choixIdx) => (
                          <DropdownMenuItem
                            key={optionIdx + '-choix-' + choixIdx}
                            onSelect={() => {
                              setTab(String(idx));
                              setSelectedVersions(prev => ({ ...prev, [idx]: choixIdx }));
                            }}
                          >
                            {choix.titre || choix.reference || choix.contenu?.slice(0, 40) || `Option ${choixIdx + 1}`}
                          </DropdownMenuItem>
                        ));
                      }
                      // Sinon titre, référence ou contenu
                      return (
                        <DropdownMenuItem
                          key={optionIdx}
                          onSelect={() => {
                            setTab(String(idx));
                            setSelectedVersions(prev => ({ ...prev, [idx]: optionIdx }));
                          }}
                        >
                          {option.titre || option.reference || option.contenu?.slice(0, 40) || `Option ${optionIdx + 1}`}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            // Affichage du contenu principal uniquement pour AelfReading
            if (!('options' in item)) {
              const reading = item as AelfReading;
              const hasVersions = reading.versions !== undefined;
              const hasChoix = reading.choix && reading.choix.length > 0;
              if (hasVersions || hasChoix) {
                return (
                  <DropdownMenu key={idx}>
                    <DropdownMenuTrigger asChild>
                      {renderButton(reading, idx, () => setTab(String(idx)))}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {hasVersions ? (
                        <>
                          <DropdownMenuItem 
                            onSelect={() => {
                              setTab(String(idx));
                              setSelectedVersions(prev => ({ ...prev, [idx]: 0 }));
                            }}
                          >
                            Version longue {reading.versions.longue.titre ? `- ${reading.versions.longue.titre}` : ''} {reading.versions.longue.reference ? reading.versions.longue.reference : ''}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onSelect={() => {
                              setTab(String(idx));
                              setSelectedVersions(prev => ({ ...prev, [idx]: 1 }));
                            }}
                          >
                            Version brève {reading.versions.breve.titre ? `- ${reading.versions.breve.titre}` : ''} {reading.versions.breve.reference ? reading.versions.breve.reference : ''}
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
                          {option.titre || option.reference || option.contenu?.slice(0, 40) || `Option ${optionIdx + 1}`}
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
                  className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-[115px] max-w-[115px] text-black
                    data-[state=active]:bg-${accentColor}-500
                    data-[state=active]:text-white dark:data-[state=active]:text-white`}
                >
                  <span>
                    {typeIcons[reading.type || 'lecture_1'] || '📄'} 
                    {typeNames[reading.type || 'lecture_1'] || 'Lecture'}
                  </span>
                </TabsTrigger>
              );
            }
            // Cas lecture/psaume/evangile simple
            const reading = item;
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
                className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-[115px] max-w-[115px] text-black
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

      {normalizedReadings.map((reading, idx) => {
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
