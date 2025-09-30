import { useState, useCallback, useRef } from 'react';
import { Warstwa, useLayersApi } from './useLayersApi';

interface UseOptimisticLayersReturn {
  layers: Warstwa[];
  loading: boolean;
  error: string | null;
  initializeLayers: () => Promise<void>;
  toggleVisibility: (id: string) => Promise<void>;
  toggleExpansion: (id: string) => Promise<void>;
  reorderLayers: (newLayers: Warstwa[]) => Promise<void>;
  setSelectedLayer: (layer: Warstwa | null) => void;
  selectedLayer: Warstwa | null;
  clearError: () => void;
}

export const useOptimisticLayers = (): UseOptimisticLayersReturn => {
  const [layers, setLayers] = useState<Warstwa[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<Warstwa | null>(null);
  const previousLayers = useRef<Warstwa[]>([]);
  
  const api = useLayersApi();

  const initializeLayers = useCallback(async () => {
    try {
      const fetchedLayers = await api.fetchLayers();
      setLayers(fetchedLayers);
      previousLayers.current = fetchedLayers;
    } catch (error) {
      console.error('Failed to initialize layers:', error);
    }
  }, [api]);

  const updateLayerProperty = useCallback((
    layers: Warstwa[],
    id: string,
    updater: (layer: Warstwa) => Warstwa
  ): Warstwa[] => {
    return layers.map(layer => {
      if (layer.id === id) {
        return updater(layer);
      }
      if (layer.dzieci) {
        return {
          ...layer,
          dzieci: updateLayerProperty(layer.dzieci, id, updater)
        };
      }
      return layer;
    });
  }, []);

  const toggleVisibility = useCallback(async (id: string) => {
    // Store current state for rollback
    previousLayers.current = layers;
    
    // Optimistic update
    const newLayers = updateLayerProperty(layers, id, layer => ({
      ...layer,
      widoczna: !layer.widoczna
    }));
    setLayers(newLayers);

    // Update selected layer if it's the one being changed
    if (selectedLayer?.id === id) {
      setSelectedLayer(prev => prev ? { ...prev, widoczna: !prev.widoczna } : null);
    }

    try {
      const targetLayer = findLayerById(newLayers, id);
      if (targetLayer) {
        await api.updateLayerVisibility(id, targetLayer.widoczna);
      }
    } catch (error) {
      // Rollback on error
      setLayers(previousLayers.current);
      if (selectedLayer?.id === id) {
        setSelectedLayer(prev => prev ? { ...prev, widoczna: !prev.widoczna } : null);
      }
      console.error('Failed to update layer visibility:', error);
    }
  }, [layers, selectedLayer, updateLayerProperty, api]);

  const toggleExpansion = useCallback(async (id: string) => {
    // Store current state for rollback
    previousLayers.current = layers;
    
    // Optimistic update
    const newLayers = updateLayerProperty(layers, id, layer => ({
      ...layer,
      rozwinięta: !layer.rozwinięta
    }));
    setLayers(newLayers);

    try {
      const targetLayer = findLayerById(newLayers, id);
      if (targetLayer) {
        await api.toggleLayerExpansion(id, targetLayer.rozwinięta || false);
      }
    } catch (error) {
      // Rollback on error
      setLayers(previousLayers.current);
      console.error('Failed to update layer expansion:', error);
    }
  }, [layers, updateLayerProperty, api]);

  const reorderLayers = useCallback(async (newLayers: Warstwa[]) => {
    // Store current state for rollback
    previousLayers.current = layers;
    
    // Optimistic update
    setLayers(newLayers);

    try {
      await api.updateLayerOrder(newLayers);
    } catch (error) {
      // Rollback on error
      setLayers(previousLayers.current);
      console.error('Failed to reorder layers:', error);
    }
  }, [layers, api]);

  const findLayerById = (layers: Warstwa[], id: string): Warstwa | null => {
    for (const layer of layers) {
      if (layer.id === id) return layer;
      if (layer.dzieci) {
        const found = findLayerById(layer.dzieci, id);
        if (found) return found;
      }
    }
    return null;
  };

  return {
    layers,
    loading: api.loading,
    error: api.error,
    initializeLayers,
    toggleVisibility,
    toggleExpansion,
    reorderLayers,
    setSelectedLayer,
    selectedLayer,
    clearError: api.clearError,
  };
};