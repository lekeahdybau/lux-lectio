import { useState, useEffect, useCallback } from 'react';

interface LiturgicalData {
  informations?: {
    couleur?: string;
    [key: string]: any;
  };
  lectures?: any[];
  messes?: Array<{
    nom: string;
    lectures: any[];
    [key: string]: any;
  }>;
  [key: string]: any;
}

export function useLiturgical() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [liturgicalData, setLiturgicalData] = useState<LiturgicalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiturgicalData = useCallback(async (date: Date) => {
    try {
      setLoading(true);
      setError(null);
      
      // Format date as YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0];
      
      // Fetch data from the API
      const response = await fetch(`/api/aelf?date=${formattedDate}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch liturgical data');
      }
      
      const data = await response.json();
      setLiturgicalData(data);
    } catch (err) {
      console.error('Error fetching liturgical data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLiturgicalData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when date changes
  useEffect(() => {
    fetchLiturgicalData(currentDate);
  }, [currentDate, fetchLiturgicalData]);

  // Refresh function to manually refetch data
  const refreshData = useCallback(() => {
    fetchLiturgicalData(currentDate);
  }, [currentDate, fetchLiturgicalData]);

  return {
    currentDate,
    setCurrentDate,
    liturgicalData,
    refreshData,
    loading,
    error,
  };
}
