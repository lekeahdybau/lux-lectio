import React, { useState, useRef, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ReadingCard } from "@/components/reading-card"

export function ReadingsTabs({ readings, accentColor }: { readings: any[], accentColor: string }) {
  const [tab, setTab] = useState("0");
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollLeft = 0;
    }
  }, [readings]);
  
  useEffect(() => {
    if (tab !== "0" && triggerRefs.current[parseInt(tab)]) {
      // Désactivation du défilement automatique
      // triggerRefs.current[parseInt(tab)]?.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [tab, readings]);

  const getReadingLabel = (reading: any, idx: number) => {
    const typeIcons: Record<string, string> = {
      lecture: '📖',
      psaume: '🎵',
      cantique: '🎵',
      evangile: '✝️',
      sequence: '🎵'
    };

    const typeNames: Record<string, string | ((idx: number) => string)> = {
      lecture: (idx: number) => `Lecture_${idx + 1}`,
      psaume: 'Psaume',
      cantique: 'Cantique',
      evangile: 'Évangile',
      sequence: 'Séquence'
    };
    
    const type = reading.type?.toLowerCase();
    if (!type) return null;
    
    const icon = typeIcons[type] || '📄';
    const name = typeof typeNames[type] === 'function' 
      ? (typeNames[type] as (idx: number) => string)(idx)
      : (typeNames[type] as string || `Lecture_${idx + 1}`);
    
    return { icon, name };
  };

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <div className="relative flex items-center">
        <TabsList
          ref={listRef}
          className={`mb-2 rounded-lg shadow bg-${accentColor}-100 dark:bg-${accentColor}-900 border border-${accentColor}-500 flex p-1 transition-all overflow-x-auto scrollbar-thin animate-navbar-tabs scrollbar-visible`}
          style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth', minWidth: 'fit-content' }}
        >
          {readings.map((reading, idx) => (
            <TabsTrigger
              key={idx}
              value={String(idx)}
              ref={el => { triggerRefs.current[idx] = el; }}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 text-black
                data-[state=active]:bg-${accentColor}-500
                data-[state=active]:text-white dark:data-[state=active]:text-white`}
            >
              {(() => {
                const label = getReadingLabel(reading, idx);
                return label ? <span>{label.icon} {label.name}</span> : null;
              })()}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {readings.map((reading, idx) => (
        <TabsContent key={idx} value={String(idx)}>
          <ReadingCard reading={reading} type={reading.type} className="animate-slide-in-right" />
        </TabsContent>
      ))}
    </Tabs>
  );
}
