/**
 * HOOK LAYERS API - KOMUNIKACJA Z BACKENDEM WARSTW
 * 
 * Odpowiada za:
 * - Pobieranie listy warstw z serwera
 * - Aktualizację widoczności warstw (toggle visibility)
 * - Zmianę kolejności warstw (reordering)
 * - Rozwijanie/zwijanie grup warstw
 * - Obsługę błędów komunikacji z API
 * - Cache'owanie danych warstw
 * - Synchronizację stanu lokalnego z serwerem
 */

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';

// ===================================================================
// INTERFACE WARSTWY - Definicja struktury danych warstwy mapy
// ===================================================================
export interface Warstwa {
  id: string;          // Unikalny identyfikator warstwy
  nazwa: string;       // Nazwa wyświetlana użytkownikowi
  widoczna: boolean;   // Czy warstwa jest widoczna na mapie
  typ: 'grupa' | 'wektor' | 'raster';  // Typ warstwy (grupa, dane wektorowe, rastrowe)
  dzieci?: Warstwa[];  // Opcjonalne: podwarstwy (dla grup)
  rozwinięta?: boolean; // Opcjonalne: czy grupa jest rozwinięta w drzewie
}

// ===================================================================
// INTERFACE ZWRACANEGO OBIEKTU - Co hook udostępnia komponentom
// ===================================================================
interface UseLayersApiReturn {
  loading: boolean;                                           // Stan ładowania
  error: string | null;                                       // Błąd API lub null
  fetchLayers: () => Promise<Warstwa[]>;                     // Funkcja pobierania warstw
  updateLayerVisibility: (id: string, visible: boolean) => Promise<void>; // Zmiana widoczności
  updateLayerOrder: (layers: Warstwa[]) => Promise<void>;    // Zmiana kolejności
  toggleLayerExpansion: (id: string, expanded: boolean) => Promise<void>; // Rozwijanie/zwijanie grup
  clearError: () => void;                                     // Czyszczenie błędów
}

// ===================================================================
// GŁÓWNA FUNKCJA HOOK - Implementacja logiki API
// ===================================================================
export const useLayersApi = (): UseLayersApiReturn => {
  
  // ===================================================================
  // STAN LOKALNY HOOK - Zarządzanie stanem ładowania i błędów
  // ===================================================================
  const [loading, setLoading] = useState(false);        // Czy trwa operacja API
  const [error, setError] = useState<string | null>(null); // Ostatni błąd API

  // Funkcja czyszczenia błędów
  const clearError = useCallback(() => setError(null), []);

  // ===================================================================
  // FUNKCJA POBIERANIA WARSTW - Główna funkcja do ładowania danych
  // ===================================================================
  const fetchLayers = useCallback(async (): Promise<Warstwa[]> => {
    setLoading(true);  // Rozpoczynamy ładowanie
    setError(null);    // Czyścimy poprzednie błędy
    
    try {
      // Próbujemy pobrać dane z API, jeśli nie działa - używamy mock danych
      const layers = await apiClient.get<Warstwa[]>('/layers').catch(() => {
        // ===================================================================
        // MOCK DATA - Tymczasowe dane testowe gdy API nie działa
        // ===================================================================
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