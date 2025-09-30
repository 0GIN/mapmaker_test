import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';

export interface Warstwa {
  id: string;
  nazwa: string;
  widoczna: boolean;
  typ: 'grupa' | 'wektor' | 'raster';
  dzieci?: Warstwa[];
  rozwinięta?: boolean;
}

interface UseLayersApiReturn {
  loading: boolean;
  error: string | null;
  fetchLayers: () => Promise<Warstwa[]>;
  updateLayerVisibility: (id: string, visible: boolean) => Promise<void>;
  updateLayerOrder: (layers: Warstwa[]) => Promise<void>;
  toggleLayerExpansion: (id: string, expanded: boolean) => Promise<void>;
  clearError: () => void;
}

export const useLayersApi = (): UseLayersApiReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchLayers = useCallback(async (): Promise<Warstwa[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // Fallback do mock danych jeśli API nie działa
      const layers = await apiClient.get<Warstwa[]>('/layers').catch(() => {
        // Mock data jako fallback
        return [
          {
            id: 'obszar-rewitalizacji',
            nazwa: 'Obszar Rewitalizacji',
            widoczna: true,
            typ: 'grupa' as const,
            rozwinięta: true,
            dzieci: [
              {
                id: 'miejscowe-plany',
                nazwa: 'MIEJSCOWE PLANY ZAGOSPODAROWANIA...',
                widoczna: true,
                typ: 'grupa' as const,
                rozwinięta: false,
                dzieci: [
                  { id: 'xxvii-282-2001', nazwa: 'XXVII_282_2001', widoczna: true, typ: 'wektor' as const },
                  { id: 'xxxvii-283-2001', nazwa: 'XXXVII_283_2001', widoczna: true, typ: 'wektor' as const },
                  { id: 'xxxvii-286-2001', nazwa: 'XXXVII_286_2001', widoczna: true, typ: 'wektor' as const },
                ]
              }
            ]
          }
        ];
      });
      
      return layers;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Błąd podczas pobierania warstw';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLayerVisibility = useCallback(async (id: string, visible: boolean): Promise<void> => {
    setError(null);
    
    try {
      await apiClient.put(`/layers/${id}/visibility`, { widoczna: visible });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Błąd podczas aktualizacji widoczności';
      setError(message);
      throw err;
    }
  }, []);

  const updateLayerOrder = useCallback(async (layers: Warstwa[]): Promise<void> => {
    setError(null);
    
    try {
      await apiClient.put('/layers/reorder', { layers });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Błąd podczas zmiany kolejności warstw';
      setError(message);
      throw err;
    }
  }, []);

  const toggleLayerExpansion = useCallback(async (id: string, expanded: boolean): Promise<void> => {
    setError(null);
    
    try {
      await apiClient.put(`/layers/${id}/expansion`, { rozwinięta: expanded });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Błąd podczas zmiany stanu rozwinięcia';
      setError(message);
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    fetchLayers,
    updateLayerVisibility,
    updateLayerOrder,
    toggleLayerExpansion,
    clearError,
  };
};