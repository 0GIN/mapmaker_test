'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box, 
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  ListItemIcon,
  Typography,
  Divider,
  Tooltip,
  TextField,
  MenuItem,
  Button
} from '@mui/material';
import { useOptimisticLayers } from '@/hooks/useOptimisticLayers';
import { Warstwa } from '@/hooks/useLayersApi';
import { 
  layerIconColors, 
  dropZoneColors, 
  sidebarStyles 
} from '@/config/theme';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { 
  Menu as MenuIcon,
  Close as CloseIcon,
  Map as MapIcon,
  Layers as LayersIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Save as SaveIcon,
  Print as PrintIcon,
  Logout as LogoutIcon,
  DragHandle as DragHandleIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Folder as FolderIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Opacity as OpacityIcon,
  ZoomInMap as ZoomInMapIcon,
  Terrain as TerrainIcon,
  Favorite as FavoriteIcon,
  ExpandLess as ExpandLessIcon,
  CalendarToday as CalendarTodayIcon,
  Public as PublicIcon,
  Language as LanguageIcon,
  AddBox as AddBoxIcon,
  ArrowUpward as ArrowUpwardIcon,
  Clear as ClearIcon,
  Chat as ChatIcon,
  Star as StarIcon,
  Edit as EditIcon,
  GitHub as GitHubIcon,
  ViewList as ViewListIcon,
  Lock as LockIcon
} from '@mui/icons-material';

// Interface przeniesiony do hooks/useLayersApi.ts

declare global {
  interface Window {
    Sortable: any;
  }
}

export default function HomePage() {
  // Stała dla strefy drop głównego poziomu
  const MAIN_LEVEL_DROP_ID = '__main_level__';
  
  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMainLevelZone, setShowMainLevelZone] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside'>('before');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'wszystko' | 'wektor' | 'raster' | 'wms'>('wszystko');

  // Stan dla rozwijanych sekcji w panelu właściwości
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    'informacje-ogolne': false,
    'pobieranie': false,
    'widocznosc': false,
    'informacje-szczegolowe': false,
    'informacje-szczegolowe-grupa': false,
    'uslugi': false,
    'metadane': false,
    'inne-projekty': false,
    // Sekcje dla warstwy (z prefiksem warstwy-)
    'warstwa-informacje-ogolne': false,
    'warstwa-pobieranie': false,
    'warstwa-widocznosc': false,
    'warstwa-informacje-szczegolowe': false,
    'warstwa-styl-warstwy': false
  });

  // Stany dla checkboxów w różnych sekcjach
  const [checkboxStates, setCheckboxStates] = useState({
    // Właściwości grupy - sekcja Widoczność
    grupaDomyslneWyswietlanie: true,
    
    // Właściwości warstwy - sekcja Widoczność
    warstwaDomyslneWyswietlanie: true,
    warstwaWidocznoscOdSkali: false,
    warstwaWidocznoscTrybOpublikowany: true
  });

  // Tymczasowo używamy warstw na sztywno
  const [selectedLayer, setSelectedLayer] = useState<Warstwa | null>(null);
  const [warstwy, setWarstwy] = useState<Warstwa[]>([
    {
      id: 'obszar-rewitalizacji',
      nazwa: 'Obszar Rewitalizacji',
      widoczna: true,
      typ: 'grupa',
      rozwinięta: true,
      dzieci: [
        {
          id: 'miejscowe-plany',
          nazwa: 'MIEJSCOWE PLANY ZAGOSPODAROWANIA...',
          widoczna: true,
          typ: 'grupa',
          rozwinięta: false,
          dzieci: [
            { id: 'xxvii-282-2001', nazwa: 'XXVII_282_2001', widoczna: true, typ: 'wektor' },
            { id: 'xxxvii-283-2001', nazwa: 'XXXVII_283_2001', widoczna: true, typ: 'wektor' },
            { id: 'xxxvii-286-2001', nazwa: 'XXXVII_286_2001', widoczna: true, typ: 'wektor' },
            { id: 'xlii-307-2002', nazwa: 'XLII_307_2002', widoczna: true, typ: 'wektor' },
            { id: 'xlii-308-2002', nazwa: 'XLII_308_2002', widoczna: true, typ: 'wektor' },
            { id: 'xlviii-335-2002', nazwa: 'XLVIII_335_2002', widoczna: true, typ: 'wektor' },
            { id: 'xxxviii-325-2005', nazwa: 'XXXVIII_325_2005', widoczna: true, typ: 'wektor' }
          ]
        },
        {
          id: 'granice',
          nazwa: 'Granice',
          widoczna: false,
          typ: 'grupa',
          rozwinięta: true,
          dzieci: [
            { id: 'granica-miasta-gminy', nazwa: 'Granica Miasta i Gminy', widoczna: false, typ: 'wektor' },
            { id: 'granica-miasta-ogrodzieniec', nazwa: 'Granica Miasta Ogrodzieniec', widoczna: false, typ: 'wektor' },
            { id: 'granice-obreby-geodezyjne', nazwa: 'Granice obręby geodezyjne...', widoczna: false, typ: 'wektor' },
            { id: 'granice-dzialek-1-10000', nazwa: '(< 1:10000) Granice działek ...', widoczna: false, typ: 'wektor' }
          ]
        }
      ]
    }
  ]);

  // Zamknij menu filtrowania przy kliknięciu poza nim
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuOpen) {
        setFilterMenuOpen(false);
      }
    };

    if (filterMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [filterMenuOpen]);

  // Debug - monitoruj zmiany stanu warstwy
  useEffect(() => {
    console.log('🎯 Warstwy state changed:', warstwy.map(w => w.nazwa));
  }, [warstwy]);

  const toggleVisibility = (id: string) => {
    const updateWarstwy = (warstwy: Warstwa[]): Warstwa[] => {
      return warstwy.map(warstwa => {
        if (warstwa.id === id) {
          const newWarstwa = { ...warstwa, widoczna: !warstwa.widoczna };
          if (newWarstwa.dzieci) {
            newWarstwa.dzieci = newWarstwa.dzieci.map(dziecko => ({
              ...dziecko,
              widoczna: newWarstwa.widoczna
            }));
          }
          return newWarstwa;
        }
        if (warstwa.dzieci) {
          return { ...warstwa, dzieci: updateWarstwy(warstwa.dzieci) };
        }
        return warstwa;
      });
    };
    setWarstwy(updateWarstwy(warstwy));
  };

  const toggleExpansion = (id: string) => {
    const updateExpansion = (warstwy: Warstwa[]): Warstwa[] => {
      return warstwy.map(warstwa => {
        if (warstwa.id === id && warstwa.typ === 'grupa') {
          return { ...warstwa, rozwinięta: !warstwa.rozwinięta };
        }
        if (warstwa.dzieci) {
          return { ...warstwa, dzieci: updateExpansion(warstwa.dzieci) };
        }
        return warstwa;
      });
    };
    setWarstwy(updateExpansion(warstwy));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleCheckbox = (checkboxName: keyof typeof checkboxStates) => {
    setCheckboxStates(prev => ({
      ...prev,
      [checkboxName]: !prev[checkboxName]
    }));
    console.log(`Toggle checkbox: ${checkboxName}`, !checkboxStates[checkboxName]);
  };

  // ===================================================================
  // FUNKCJE OBSŁUGUJĄCE ENDPOINTY STYLU WARSTWY
  // ===================================================================
  
  /**
   * Obsługuje edycję stylu warstwy - wywołuje endpoint do edycji
   */
  const handleEditLayerStyle = async () => {
    if (!selectedLayer) {
      console.warn('Brak wybranej warstwy do edycji');
      return;
    }

    try {
      console.log(`🎨 Edytuj styl warstwy: ${selectedLayer.nazwa}`);
      
      // Przykład wywołania endpointu (zakomentowane - do odkomentowania gdy będzie backend)
      // const response = await apiClient.post(`/layers/${selectedLayer.id}/style/edit`, {
      //   layerId: selectedLayer.id,
      //   action: 'edit'
      // });
      
      // Tymczasowo symulacja
      console.log('📡 Wywołanie endpointu: POST /api/layers/style/edit');
      console.log('📦 Payload:', {
        layerId: selectedLayer.id,
        layerName: selectedLayer.nazwa,
        action: 'edit'
      });
      
      // Przykład obsługi odpowiedzi
      // if (response.success) {
      //   console.log('✅ Styl warstwy został zaktualizowany');
      // }
      
    } catch (error) {
      console.error('❌ Błąd podczas edycji stylu:', error);
    }
  };

  /**
   * Obsługuje zarządzanie warstwą - wywołuje endpoint do zarządzania
   */
  const handleManageLayer = async () => {
    if (!selectedLayer) {
      console.warn('Brak wybranej warstwy do zarządzania');
      return;
    }

    try {
      console.log(`⚙️ Zarządzaj warstwą: ${selectedLayer.nazwa}`);
      
      // Przykład wywołania endpointu
      // const response = await apiClient.post(`/layers/${selectedLayer.id}/manage`, {
      //   layerId: selectedLayer.id,
      //   action: 'manage'
      // });
      
      console.log('📡 Wywołanie endpointu: POST /api/layers/manage');
      console.log('📦 Payload:', {
        layerId: selectedLayer.id,
        layerName: selectedLayer.nazwa,
        layerType: selectedLayer.typ,
        action: 'manage'
      });
      
    } catch (error) {
      console.error('❌ Błąd podczas zarządzania warstwą:', error);
    }
  };

  /**
   * Obsługuje etykietowanie warstwy - wywołuje endpoint do etykiet
   */
  const handleLayerLabeling = async () => {
    if (!selectedLayer) {
      console.warn('Brak wybranej warstwy do etykietowania');
      return;
    }

    try {
      console.log(`🏷️ Etykietowanie warstwy: ${selectedLayer.nazwa}`);
      
      // Przykład wywołania endpointu
      // const response = await apiClient.post(`/layers/${selectedLayer.id}/labels`, {
      //   layerId: selectedLayer.id,
      //   action: 'labeling'
      // });
      
      console.log('📡 Wywołanie endpointu: POST /api/layers/labels');
      console.log('📦 Payload:', {
        layerId: selectedLayer.id,
        layerName: selectedLayer.nazwa,
        layerType: selectedLayer.typ,
        action: 'labeling'
      });
      
    } catch (error) {
      console.error('❌ Błąd podczas etykietowania:', error);
    }
  };

  const getWarstwaIcon = (typ: 'grupa' | 'wektor' | 'raster', id?: string) => {
    switch (typ) {
      case 'grupa': return <FolderIcon sx={{ color: layerIconColors.grupa }} />; // Niebieska ikona folderu dla katalogów
      case 'wektor': return <LayersIcon sx={{ color: layerIconColors.wektor }} />; // Zielona ikona dla warstw wektorowych
      case 'raster': return <LayersIcon sx={{ color: layerIconColors.raster }} />; // Zielona ikona dla warstw rastrowych
      default: return <LayersIcon sx={{ color: layerIconColors.default }} />; // Domyślnie zielona ikona warstwy
    }
  };

  const filterWarstwy = (warstwy: Warstwa[], filter: string): Warstwa[] => {
    if (!filter) return warstwy;
    return warstwy.filter(warstwa => {
      const matchesName = warstwa.nazwa.toLowerCase().includes(filter.toLowerCase());
      const hasMatchingChildren = warstwa.dzieci && 
        filterWarstwy(warstwa.dzieci, filter).length > 0;
      return matchesName || hasMatchingChildren;
    }).map(warstwa => ({
      ...warstwa,
      dzieci: warstwa.dzieci ? filterWarstwy(warstwa.dzieci, filter) : undefined
    }));
  };

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

  const findParentGroup = (layers: Warstwa[], childId: string): Warstwa | null => {
    for (const layer of layers) {
      if (layer.dzieci) {
        // Sprawdź czy dziecko jest bezpośrednio w tej grupie
        const directChild = layer.dzieci.find(child => child.id === childId);
        if (directChild) {
          return layer;
        }
        // Sprawdź rekurencyjnie w podgrupach
        const found = findParentGroup(layer.dzieci, childId);
        if (found) return found;
      }
    }
    return null;
  };

  const handleLayerSelect = (id: string) => {
    const layer = findLayerById(warstwy, id);
    setSelectedLayer(layer);
    console.log('Selected layer:', layer?.nazwa);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    console.log('🟢 Drag started:', id);
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const cleanupDragState = () => {
    setDraggedItem(null);
    setDropTarget(null);
    setShowMainLevelZone(false);
  };

  const handleDragEnd = () => {
    cleanupDragState();
  };

  const handleDragEnter = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔵 Drag enter on:', id); // Debug
    
    if (draggedItem && draggedItem !== id) {
      // Sprawdź czy nie próbujemy przeciągnąć elementu na samego siebie lub na swoje dziecko
      const isValidTarget = !isDescendant(draggedItem, id);
      if (isValidTarget) {
        // Określ pozycję drop na podstawie pozycji myszy względem elementu
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseY = e.clientY;
        const elementMiddle = rect.top + rect.height / 2;
        
        const position = mouseY < elementMiddle ? 'before' : 'after';
        
        setDropTarget(id);
        setDropPosition(position);
        console.log('✅ Valid target set:', id, 'position:', position);
      } else {
        console.log('❌ Invalid target (descendant):', id);
      }
    }
  };

  // Funkcja pomocnicza do sprawdzania czy target nie jest dzieckiem dragged item
  const isDescendant = (parentId: string, childId: string): boolean => {
    const findInTree = (items: Warstwa[], searchId: string): Warstwa | null => {
      for (const item of items) {
        if (item.id === searchId) return item;
        if (item.dzieci) {
          const found = findInTree(item.dzieci, searchId);
          if (found) return found;
        }
      }
      return null;
    };

    const parent = findInTree(warstwy, parentId);
    if (!parent || !parent.dzieci) return false;

    const checkChildren = (items: Warstwa[]): boolean => {
      for (const item of items) {
        if (item.id === childId) return true;
        if (item.dzieci && checkChildren(item.dzieci)) return true;
      }
      return false;
    };

    return checkChildren(parent.dzieci);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Sprawdź czy naprawdę opuszczamy element (nie przechodzimy do dziecka)
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeavingElement = (
      e.clientX < rect.left || 
      e.clientX > rect.right || 
      e.clientY < rect.top || 
      e.clientY > rect.bottom
    );
    
    if (isLeavingElement) {
      setDropTarget(null);
      setDropPosition('before');
    }
  };

  const handleDragOver = (e: React.DragEvent, id?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // WAŻNE: Bez tego onDrop się nie wykonuje!
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    
    // Zaawansowana detekcja typu operacji podczas przeciągania
    if (draggedItem && id && id !== draggedItem) {
      const isValidTarget = !isDescendant(draggedItem, id);
      if (isValidTarget) {
        const target = findLayerById(warstwy, id);
        if (!target) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseY = e.clientY;
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const relativeY = (mouseY - elementTop) / elementHeight;
        
        let position: 'before' | 'after' | 'inside' = 'before';
        
        // Jeśli target to grupa i mysz jest w środkowej części (25%-75%), to group drop
        if (target.typ === 'grupa' && relativeY > 0.25 && relativeY < 0.75) {
          position = 'inside';
        } else {
          // Standardowe before/after dla reordering
          position = relativeY < 0.5 ? 'before' : 'after';
        }
        
        // Aktualizuj state tylko gdy się zmieni
        if (dropTarget !== id || dropPosition !== position) {
          setDropTarget(id);
          setDropPosition(position);
          
          // Wizualne wskazówki
          if (position === 'inside') {
            console.log(`🗂️ Group drop mode: ${draggedItem} → into ${id}`);
          } else {
            console.log(`📋 Reorder mode: ${draggedItem} → ${position} ${id}`);
          }
        }
      }
    }
  };

  const handleLayerTreeDragOver = (e: React.DragEvent) => {
    if (!draggedItem) return;
    
    // Sprawdź pozycję myszy względem kontenera
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX;
    const leftEdge = rect.left;
    
    // Jeśli mysz jest w pierwszych 30px od lewej krawędzi, pokaż strefę główną
    const isInLeftZone = mouseX - leftEdge < 30;
    
    if (isInLeftZone !== showMainLevelZone) {
      setShowMainLevelZone(isInLeftZone);
      if (isInLeftZone) {
        console.log('🏠 Entering main level zone');
      } else {
        console.log('🔄 Leaving main level zone');
      }
    }
  };

  const handleMainLevelDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    
    if (draggedItem && dropTarget !== MAIN_LEVEL_DROP_ID) {
      setDropTarget(MAIN_LEVEL_DROP_ID);
      setDropPosition('after'); // Nie używane, ale dla kompatybilności
      console.log('🏠 Main level hover');
    }
  };

  // ===================================================================
  // ZAAWANSOWANE ZARZĄDZANIE HIERARCHIĄ WARSTW I GRUP
  // ===================================================================
  
  /**
   * Znajduje element w hierarchii i zwraca ścieżkę do niego
   */
  const findElementPath = (items: Warstwa[], targetId: string, currentPath: number[] = []): number[] | null => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === targetId) {
        return [...currentPath, i];
      }
      if (items[i].dzieci) {
        const found = findElementPath(items[i].dzieci!, targetId, [...currentPath, i]);
        if (found) return found;
      }
    }
    return null;
  };

  /**
   * Usuwa element z hierarchii na podstawie ścieżki
   */
  const removeElementAtPath = (items: Warstwa[], path: number[]): { newItems: Warstwa[], removedElement: Warstwa | null } => {
    if (path.length === 0) return { newItems: items, removedElement: null };
    
    const newItems = [...items];
    let current = newItems;
    let removedElement: Warstwa | null = null;
    
    // Nawiguj do właściwego miejsca
    for (let i = 0; i < path.length - 1; i++) {
      if (current[path[i]].dzieci) {
        current[path[i]] = { ...current[path[i]], dzieci: [...current[path[i]].dzieci!] };
        current = current[path[i]].dzieci!;
      }
    }
    
    // Usuń element z ostatniego poziomu
    const finalIndex = path[path.length - 1];
    if (finalIndex >= 0 && finalIndex < current.length) {
      removedElement = current[finalIndex];
      current.splice(finalIndex, 1);
    }
    
    return { newItems, removedElement };
  };

  /**
   * Wstawia element w hierarchii na określonej pozycji
   */
  const insertElementAtPath = (items: Warstwa[], element: Warstwa, path: number[], position: 'before' | 'after' | 'inside'): Warstwa[] => {
    if (path.length === 0) {
      // Wstawianie na głównym poziomie
      const newItems = [...items];
      if (position === 'before') {
        newItems.splice(0, 0, element);
      } else {
        newItems.push(element);
      }
      return newItems;
    }
    
    const newItems = [...items];
    let current = newItems;
    
    // Nawiguj do właściwego miejsca
    for (let i = 0; i < path.length - 1; i++) {
      if (current[path[i]].dzieci) {
        current[path[i]] = { ...current[path[i]], dzieci: [...current[path[i]].dzieci!] };
        current = current[path[i]].dzieci!;
      }
    }
    
    const finalIndex = path[path.length - 1];
    
    if (position === 'inside') {
      // Wstawianie do grupy jako dziecko
      if (current[finalIndex].typ === 'grupa') {
        current[finalIndex] = {
          ...current[finalIndex],
          dzieci: current[finalIndex].dzieci ? [...current[finalIndex].dzieci, element] : [element],
          rozwinięta: true // Automatycznie rozwiń grupę
        };
      }
    } else if (position === 'before') {
      current.splice(finalIndex, 0, element);
    } else { // 'after'
      current.splice(finalIndex + 1, 0, element);
    }
    
    return newItems;
  };

  /**
   * Określa typ operacji drop na podstawie pozycji myszy i typu elementu
   */
  const getDropOperation = (e: React.DragEvent, targetId: string): 'reorder' | 'move-to-group' | 'move-between-groups' => {
    const target = findLayerById(warstwy, targetId);
    if (!target) return 'reorder';
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY;
    const elementTop = rect.top;
    const elementBottom = rect.bottom;
    const elementHeight = rect.height;
    
    // Jeśli target to grupa i mysz jest w środkowej części (30%-70%), to move-to-group
    if (target.typ === 'grupa') {
      const relativeY = (mouseY - elementTop) / elementHeight;
      if (relativeY > 0.3 && relativeY < 0.7) {
        return 'move-to-group';
      }
    }
    
    return 'move-between-groups';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔴 ADVANCED DROP! Target:', targetId, 'Dragged:', draggedItem);
    
    if (!draggedItem || draggedItem === targetId) {
      console.log('❌ Invalid drop');
      setDropTarget(null);
      setShowMainLevelZone(false);
      return;
    }

    // Specjalna obsługa dla strefy głównego poziomu
    if (targetId === MAIN_LEVEL_DROP_ID) {
      console.log('🏠 DROP TO MAIN LEVEL!');
      
      const draggedPath = findElementPath(warstwy, draggedItem);
      if (!draggedPath) {
        console.log('❌ Could not find dragged element path');
        setDropTarget(null);
        return;
      }

      let newWarstwy = [...warstwy];
      
      // Usuń element z aktualnej pozycji
      const { newItems: itemsAfterRemoval, removedElement } = removeElementAtPath(newWarstwy, draggedPath);
      if (!removedElement) {
        console.log('❌ Could not remove element');
        setDropTarget(null);
        return;
      }
      
      // Dodaj na koniec głównego poziomu
      newWarstwy = [...itemsAfterRemoval, removedElement];
      
      console.log('✅ Main level drop completed');
      setWarstwy(newWarstwy);
      setDraggedItem(null);
      setDropTarget(null);
      setShowMainLevelZone(false); // Resetuj strefę główną
      return;
    }

    // Sprawdź czy nie próbujemy wrzucić grupy do jej własnego dziecka
    if (isDescendant(draggedItem, targetId)) {
      console.log('❌ Cannot drop parent into its own child');
      setDropTarget(null);
      setShowMainLevelZone(false);
      return;
    }

    const operation = getDropOperation(e, targetId);
    console.log('🎯 Drop operation:', operation);

    // Znajdź ścieżki do elementów
    const draggedPath = findElementPath(warstwy, draggedItem);
    const targetPath = findElementPath(warstwy, targetId);
    
    if (!draggedPath || !targetPath) {
      console.log('❌ Could not find element paths');
      setDropTarget(null);
      return;
    }

    let newWarstwy = [...warstwy];
    
    // 1. Usuń przeciągnięty element
    const { newItems: itemsAfterRemoval, removedElement } = removeElementAtPath(newWarstwy, draggedPath);
    if (!removedElement) {
      console.log('❌ Could not remove dragged element');
      setDropTarget(null);
      return;
    }
    
    console.log('📦 Removed element:', removedElement.nazwa);
    newWarstwy = itemsAfterRemoval;
    
    // 2. Znajdź nową ścieżkę do targetu (po usunięciu elementu)
    const newTargetPath = findElementPath(newWarstwy, targetId);
    if (!newTargetPath) {
      console.log('❌ Could not find target after removal');
      setDropTarget(null);
      return;
    }
    
    // 3. Wstaw element w nowym miejscu
    if (operation === 'move-to-group') {
      console.log('📁 Moving to group:', targetId);
      newWarstwy = insertElementAtPath(newWarstwy, removedElement, newTargetPath, 'inside');
    } else {
      console.log('📋 Reordering/moving between groups:', dropPosition);
      newWarstwy = insertElementAtPath(newWarstwy, removedElement, newTargetPath, dropPosition);
    }

    console.log('✅ Hierarchy operation completed');
    setWarstwy(newWarstwy);
    
    setDraggedItem(null);
    setDropTarget(null);
    setDropPosition('before');
    setShowMainLevelZone(false); // Resetuj strefę główną
  };

  const handleDropAtEnd = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedItem) {
      console.log('❌ No dragged item for end drop');
      return;
    }

    // Sprawdź czy nie próbujemy wrzucić grupy do jej własnego dziecka
    if (isDescendant(draggedItem, groupId)) {
      console.log('❌ Cannot drop parent into its own child');
      setDropTarget(null);
      return;
    }

    console.log(`🎯 Advanced drop at end of group: ${groupId}, item: ${draggedItem}`);

    // Znajdź ścieżki
    const draggedPath = findElementPath(warstwy, draggedItem);
    const groupPath = findElementPath(warstwy, groupId);
    
    if (!draggedPath || !groupPath) {
      console.log('❌ Could not find element paths');
      setDropTarget(null);
      return;
    }

    let newWarstwy = [...warstwy];
    
    // Usuń element z aktualnej pozycji
    const { newItems: itemsAfterRemoval, removedElement } = removeElementAtPath(newWarstwy, draggedPath);
    if (!removedElement) {
      console.log('❌ Could not remove element');
      setDropTarget(null);
      return;
    }
    
    newWarstwy = itemsAfterRemoval;
    
    // Znajdź nową ścieżkę do grupy (po usunięciu elementu)
    const newGroupPath = findElementPath(newWarstwy, groupId);
    if (!newGroupPath) {
      console.log('❌ Could not find group after removal');
      setDropTarget(null);
      return;
    }
    
    // Wstaw na koniec grupy
    newWarstwy = insertElementAtPath(newWarstwy, removedElement, newGroupPath, 'inside');
    
    console.log('✅ Advanced end drop completed');
    setWarstwy(newWarstwy);
    
    setDraggedItem(null);
    setDropTarget(null);
    setDropPosition('before');
    setShowMainLevelZone(false); // Resetuj strefę główną
  };

  const renderWarstwaItem = (warstwa: any, level: number = 0): React.ReactNode => {
    const isDragged = draggedItem === warstwa.id;
    const isDropTarget = dropTarget === warstwa.id;
    
    return (
      <Box key={warstwa.id} sx={{ 
        mb: -0.2, 
        position: 'relative',
        ml: showMainLevelZone ? 1.5 : 0, // Delikatny margines tylko gdy w lewej strefie
        transition: 'margin-left 0.2s ease'
      }}>
        {/* Drop indicator - różne wskazówki dla różnych operacji */}
        {isDropTarget && draggedItem && dropPosition === 'inside' && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: level * 1.5 * 8,
              right: 8,
              bottom: 0,
              border: `2px dashed ${dropZoneColors.primary}`,
              borderRadius: 1,
              zIndex: 999,
              pointerEvents: 'none',
              bgcolor: 'rgba(76, 175, 80, 0.1)',
              animation: 'groupDropIndicator 1.5s infinite',
              '@keyframes groupDropIndicator': {
                '0%': { 
                  borderColor: dropZoneColors.primary,
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  boxShadow: '0 0 8px rgba(76, 175, 80, 0.3)'
                },
                '50%': { 
                  borderColor: dropZoneColors.secondary,
                  bgcolor: 'rgba(76, 175, 80, 0.2)',
                  boxShadow: '0 0 16px rgba(76, 175, 80, 0.6)'
                },
                '100%': { 
                  borderColor: dropZoneColors.hover,
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  boxShadow: '0 0 8px rgba(76, 175, 80, 0.3)'
                }
              },
              '&::before': {
                content: '"📁"',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '16px',
                opacity: 0.7
              }
            }}
          />
        )}
        
        {isDropTarget && draggedItem && (dropPosition === 'before' || dropPosition === 'after') && (
          <Box
            sx={{
              position: 'absolute',
              top: dropPosition === 'before' ? -2 : 'auto',
              bottom: dropPosition === 'after' ? -2 : 'auto',
              left: level * 1.5 * 8,
              right: 8,
              height: 3,
              bgcolor: '#1976d2',
              borderRadius: 1.5,
              zIndex: 1000,
              pointerEvents: 'none',
              boxShadow: '0 0 8px rgba(25, 118, 210, 0.8)',
              animation: 'preciseDropIndicator 1.2s infinite',
              '@keyframes preciseDropIndicator': {
                '0%': { 
                  opacity: 0.7, 
                  transform: 'scaleX(0.8)',
                  boxShadow: '0 0 4px rgba(25, 118, 210, 0.4)'
                },
                '50%': { 
                  opacity: 1, 
                  transform: 'scaleX(1)',
                  boxShadow: '0 0 12px rgba(25, 118, 210, 1)'
                },
                '100%': { 
                  opacity: 0.7, 
                  transform: 'scaleX(0.8)',
                  boxShadow: '0 0 4px rgba(25, 118, 210, 0.4)'
                }
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                left: -4,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 8,
                height: 8,
                bgcolor: '#1976d2',
                borderRadius: '50%',
                boxShadow: '0 0 6px rgba(25, 118, 210, 0.8)'
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                right: -4,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 8,
                height: 8,
                bgcolor: '#1976d2',
                borderRadius: '50%',
                boxShadow: '0 0 6px rgba(25, 118, 210, 0.8)'
              }
            }}
          />
        )}
        
        <Box
          className="layer-item"
          draggable
          onClick={() => handleLayerSelect(warstwa.id)}
          onDragStart={(e) => handleDragStart(e, warstwa.id)}
          onDragEnd={handleDragEnd}
          onDragEnter={(e) => handleDragEnter(e, warstwa.id)}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => handleDragOver(e, warstwa.id)}
          onDrop={(e) => handleDrop(e, warstwa.id)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 0.2,
            px: 1,
            ml: level * 1.5,
            borderRadius: 4,
            cursor: isDragged ? 'grabbing' : 'pointer',
            transition: 'all 0.2s ease',
            bgcolor: isDragged ? 'rgba(79, 195, 247, 0.3)' : 
                     isDropTarget ? 'rgba(76, 175, 80, 0.2)' : 
                     selectedLayer?.id === warstwa.id ? 'rgba(255, 152, 0, 0.2)' : 'transparent',
            borderLeft: level > 0 ? '2px solid rgba(255,255,255,0.1)' : 'none',
            border: isDragged ? '2px dashed #4fc3f7' : 
                    isDropTarget ? '2px solid #4caf50' : 
                    selectedLayer?.id === warstwa.id ? '2px solid #ff9800' : 'none',
            opacity: isDragged ? 0.6 : 1,
            transform: isDragged ? 'scale(1.02) rotate(2deg)' : 'none',
            boxShadow: isDragged ? '0 8px 16px rgba(0,0,0,0.3)' : 
                       isDropTarget ? '0 0 0 2px rgba(76, 175, 80, 0.4)' : 'none',
            '&:hover': {
              bgcolor: isDragged ? 'rgba(79, 195, 247, 0.4)' : 
                       isDropTarget ? 'rgba(76, 175, 80, 0.3)' : 
                       'rgba(79, 195, 247, 0.15)',
              borderLeft: level > 0 ? '2px solid #4fc3f7' : 'none',
              transform: isDragged ? 'scale(1.02) rotate(2deg)' : 'translateX(4px)',
              '& .layer-item__actions': {
                opacity: 1
              },
              '& .drag-handle': {
                color: '#4fc3f7'
              }
            }
          }}
        >
        {/* Strzałka rozwijania dla grup lub placeholder dla warstw */}
        {warstwa.typ === 'grupa' ? (
          <Box
            onClick={(e) => {
              e.stopPropagation();
              toggleExpansion(warstwa.id);
            }}
            sx={{
              width: 16,
              height: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              mr: 0.5,
              '&:hover': { color: '#4fc3f7' }
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: warstwa.rozwinięta ? '6px 4px 0 4px' : '4px 0 4px 6px',
                borderColor: warstwa.rozwinięta 
                  ? 'rgba(255,255,255,0.8) transparent transparent transparent'
                  : 'transparent transparent transparent rgba(255,255,255,0.8)',
                transition: 'all 0.2s ease'
              }}
            />
          </Box>
        ) : (
          /* Placeholder przestrzeń dla warstw - wyrównanie checkboxów */
          <Box sx={{ width: 16, height: 16, mr: 0.5 }} />
        )}
        
        <Box
          component="input"
          type="checkbox"
          checked={warstwa.widoczna}
          onChange={() => toggleVisibility(warstwa.id)}
          onClick={(e) => e.stopPropagation()}
          sx={{
            mr: 1,
            cursor: 'pointer',
            accentColor: '#4fc3f7',
            width: 16,
            height: 16,
            '&:checked': {
              accentColor: '#4fc3f7'
            }
          }}
        />
        
        <Box sx={{ 
          mr: 1, 
          display: 'flex', 
          alignItems: 'center',
          minWidth: 20,
          justifyContent: 'center'
        }}>
          {getWarstwaIcon(warstwa.typ, warstwa.id)}
        </Box>
        
        <Tooltip title={warstwa.nazwa} arrow placement="right">
          <Typography
            sx={{
              fontSize: '13px',
              color: warstwa.widoczna ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
              flex: 1,
              fontWeight: warstwa.typ === 'grupa' ? 500 : 400,
              letterSpacing: '0.2px',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              whiteSpace: 'nowrap',        // Nie zawijaj tekstu
              overflow: 'hidden',          // Ukryj nadmiar tekstu
              textOverflow: 'ellipsis',    // Pokaż ... dla przyciętego tekstu
              cursor: 'pointer'            // Pokaż że można najechać
            }}
          >
            {warstwa.nazwa}
          </Typography>
        </Tooltip>
        
        {/* Ikony po prawej stronie jak na screenie */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Ikona celownika/GPS */}
          <Tooltip title="Przybliż do warstwy" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Zoom to:', warstwa.nazwa);
              }}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                p: 0.25,
                '&:hover': { color: '#4fc3f7' }
              }}
            >
              <ZoomInMapIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {/* Ikona kalendarza - tylko dla warstw (nie katalogów) */}
          {warstwa.typ !== 'grupa' && (
            <Tooltip title="Pokaż tabele atrybutów" arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Calendar for:', warstwa.nazwa);
                }}
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  p: 0.25,
                  '&:hover': { color: '#4fc3f7' }
                }}
              >
                <CalendarTodayIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      
      {warstwa.dzieci && warstwa.rozwinięta && (
        <Box sx={{ ml: 1 }}>
          {warstwa.dzieci.map((dziecko: any) => renderWarstwaItem(dziecko, level + 1))}
          
          {/* Specjalna strefa drop na końcu grupy */}
          <Box
            onDragEnter={(e) => handleDragEnter(e, `${warstwa.id}-end`)}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropAtEnd(e, warstwa.id)}
            sx={{
              height: draggedItem ? 12 : 4, // Mniejsza wysokość, większa tylko podczas przeciągania
              position: 'relative',
              cursor: draggedItem ? 'copy' : 'default',
              transition: 'height 0.2s ease',
              '&:hover': draggedItem ? {
                bgcolor: 'rgba(79, 195, 247, 0.05)'
              } : {}
            }}
          >
            {/* Wskaźnik drop na końcu */}
            {dropTarget === `${warstwa.id}-end` && draggedItem && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 2,
                  left: 0,
                  right: 0,
                  height: 3,
                  bgcolor: '#4fc3f7',
                  borderRadius: 1.5,
                  boxShadow: '0 0 6px rgba(79, 195, 247, 0.6)',
                  animation: 'dropPulse 1.5s infinite',
                  pointerEvents: 'none'
                }}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
  };

  const filteredWarstwy = filterWarstwy(warstwy, searchFilter);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Tło z Google Maps */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.05)),
            url("https://media.wired.com/photos/59269cd37034dc5f91bec0f1/191:100/w_1280,c_limit/GoogleMapTA.jpg?mbid=social_retweet")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1
        }}
      >
      </Box>
      
      {/* Toggle button - zawsze widoczny */}
      <IconButton
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="sidebar-toggle"
        sx={{
          position: 'fixed',
          top: 20,
          left: sidebarCollapsed ? 20 : sidebarStyles.width + 20,
          zIndex: 1300,
          transition: 'left 0.3s ease',
        }}
      >
        {sidebarCollapsed ? <MenuIcon /> : <CloseIcon />}
      </IconButton>

      {/* Lewy panel - chowający się z przezroczystym tłem */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: sidebarCollapsed ? -sidebarStyles.width : 0,
          height: '100vh',
          width: sidebarStyles.width,
          bgcolor: sidebarStyles.background,
          boxShadow: sidebarCollapsed ? 'none' : sidebarStyles.boxShadow,
          transition: 'left 0.3s ease',
          zIndex: 1200,
          borderRight: sidebarCollapsed ? 'none' : sidebarStyles.borderRight,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box className="layer-panel__header" sx={{ 
          p: 2, 
          borderBottom: sidebarStyles.header.borderBottom,
          bgcolor: sidebarStyles.header.background,
          textAlign: 'center'
        }}>
          {/* Tytuł */}
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white', 
              mb: 1, 
              fontSize: '16px',
              fontWeight: 400,
              letterSpacing: '2px',
              textTransform: 'lowercase'
            }}
          >
            nazwatestowa.pl
          </Typography>

              {/* Toolbar z 9 ikonami w jednym rzędzie */}
              <Box sx={{ 
                display: 'flex', 
                gap: 0.5, 
                mb: 0.1,
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                px: 1
              }}>
                <Tooltip title="Dodaj zbiór danych - INSPIRE" arrow>
                  <IconButton
                    size="small"
                    onClick={() => console.log('Planeta Ziemia')}
                    className="toolbar-icon"
                  >
                    <PublicIcon sx={{ fontSize: '18px' }} />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Dodaj zbór danych - PRAWO KRAJOWE" arrow>
                  <IconButton
                    size="small"
                    onClick={() => console.log('Mapa Polski')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      p: 0.5,
                      minWidth: 'auto',
                      '&:hover': { color: '#4fc3f7' }
                    }}
                  >
                    <MapIcon sx={{ fontSize: '18px' }} />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Dodaj warstwe" arrow>
                  <IconButton
                    size="small"
                    onClick={() => console.log('Dodaj')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      p: 0.5,
                      minWidth: 'auto',
                      '&:hover': { color: '#4fc3f7' }
                    }}
                  >
                    <AddBoxIcon sx={{ fontSize: '18px' }} />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Importuj warstwe" arrow>
                  <IconButton
                    size="small"
                    onClick={() => console.log('Góra')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      p: 0.5,
                      minWidth: 'auto',
                      '&:hover': { color: '#4fc3f7' }
                    }}
                  >
                    <ArrowUpwardIcon sx={{ fontSize: '18px' }} />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Dodaj grupę" arrow>
                  <IconButton
                    size="small"
                    onClick={() => console.log('Plus')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      p: 0.5,
                      minWidth: 'auto',
                      '&:hover': { color: '#4fc3f7' }
                    }}
                  >
                    <AddIcon sx={{ fontSize: '18px' }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Usuń grupę lub warstwę" arrow>
                  <IconButton
                    size="small"
                    onClick={() => console.log('Zamknij')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      p: 0.5,
                      minWidth: 'auto',
                      '&:hover': { color: '#ff6b6b' }
                    }}
                  >
                    <ClearIcon sx={{ fontSize: '18px' }} />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Utwórz konsultacje społeczne" arrow>
                  <IconButton
                    size="small"
                    onClick={() => console.log('Komentarze')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      p: 0.5,
                      minWidth: 'auto',
                      '&:hover': { color: '#4fc3f7' }
                    }}
                  >
                    <ChatIcon sx={{ fontSize: '18px' }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Menedżer warstw" arrow>
                  <IconButton
                    size="small"
                    onClick={() => console.log('Gwiazda')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      p: 0.5,
                      minWidth: 'auto',
                      '&:hover': { color: '#4fc3f7' }
                    }}
                  >
                    <StarIcon sx={{ fontSize: '18px' }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Konfiguracja wyrysu i wypisu" arrow>
                  <IconButton
                    size="small"
                    onClick={() => console.log('Edytuj')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      p: 0.5,
                      minWidth: 'auto',
                      '&:hover': { color: '#4fc3f7' }
                    }}
                  >
                    <EditIcon sx={{ fontSize: '18px' }} />
                  </IconButton>
                </Tooltip>
              </Box>

            <Box sx={{ mb: -1 }}>
              {/* Kontener z przyciskami i polem wyszukiwania */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
                {/* Przycisk po lewej stronie */}
                <Box sx={{ position: 'relative' }}>
                  <Tooltip title="Widoczność warstw" arrow>
                    <IconButton
                      size="small"
                      onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                      sx={{
                        color: filterMenuOpen ? '#4fc3f7' : 'rgba(255, 255, 255, 0.7)',
                        bgcolor: filterMenuOpen ? 'rgba(79, 195, 247, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '4px',
                        p: 0.75,
                        '&:hover': { 
                          color: '#4fc3f7',
                          bgcolor: 'rgba(79, 195, 247, 0.1)'
                        }
                      }}
                    >
                      <FilterListIcon sx={{ fontSize: '16px' }} />
                    </IconButton>
                  </Tooltip>
                  
                  {/* Dropdown menu filtrowania */}
                  {filterMenuOpen && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        mt: 0.5,
                        bgcolor: 'rgba(60, 60, 60, 0.95)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                        zIndex: 1000,
                        minWidth: 140,
                        py: 0.5,
                      }}
                    >
                      {[
                        { key: 'wszystko', label: 'Wszystko' },
                        { key: 'wektor', label: 'Wektorowe' },
                        { key: 'raster', label: 'Rastrowe' },
                        { key: 'wms', label: 'WMS' }
                      ].map((option) => (
                        <Box
                          key={option.key}
                          onClick={() => {
                            setSelectedFilter(option.key as any);
                            setFilterMenuOpen(false);
                          }}
                          sx={{
                            px: 2,
                            py: 0.3,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            color: selectedFilter === option.key ? '#4fc3f7' : '#ffffff',
                            fontSize: '13px',
                            fontWeight: selectedFilter === option.key ? 500 : 400,
                            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.1)',
                              color: '#4fc3f7'
                            }
                          }}
                        >
                          {option.label}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Pole wyszukiwania */}
                <Box
                  component="input"
                  type="text"
                  placeholder="Znajdź warstwę lub grupę"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  sx={{
                    flex: 1,
                    p: '8px 12px',
                    borderRadius: '20px',
                    border: '1px solid rgba(79, 195, 247, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.5)'
                    },
                    '&:focus': {
                      outline: 'none',
                      borderColor: '#4fc3f7',
                      bgcolor: 'rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 0 0 2px rgba(79, 195, 247, 0.2)'
                    }
                  }}
                />

                {/* Przyciski po prawej stronie */}
                <Tooltip title="Rozwiń wszystkie" arrow>
                  <IconButton
                    size="small"
                    onClick={() => console.log('Expand all')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '4px',
                      p: 0.75,
                      '&:hover': { 
                        color: '#4fc3f7',
                        bgcolor: 'rgba(79, 195, 247, 0.1)'
                      }
                    }}
                  >
                    <ExpandMoreIcon sx={{ fontSize: '16px' }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Zwiń wszystkie" arrow>
                  <IconButton
                    size="small"
                    onClick={() => console.log('Collapse all')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '4px',
                      p: 0.75,
                      '&:hover': { 
                        color: '#4fc3f7',
                        bgcolor: 'rgba(79, 195, 247, 0.1)'
                      }
                    }}
                  >
                    <ExpandLessIcon sx={{ fontSize: '16px' }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

        </Box>

        {/* Kontener dla listy warstw i panelu właściwości */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden'
        }}>
          <Box 
            className="layer-tree"
            onDragOver={handleLayerTreeDragOver}
            sx={{ 
              flex: selectedLayer ? '1 1 0%' : 1,
              minHeight: 0,
              overflow: 'auto',
              p: 1,
              position: 'relative', // Dla pozycjonowania strefy drop
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '3px'
            }
          }}
        >
          {/* Strefa drop głównego poziomu - po lewej stronie tylko gdy przeciągamy w lewo */}
          {showMainLevelZone && draggedItem && (
            <Box
              onDragOver={handleMainLevelDragOver}
              onDrop={(e) => handleDrop(e, MAIN_LEVEL_DROP_ID)}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 25,
                height: '100%',
                bgcolor: dropTarget === MAIN_LEVEL_DROP_ID ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)',
                border: dropTarget === MAIN_LEVEL_DROP_ID ? '2px solid #ff9800' : '2px dashed rgba(255, 152, 0, 0.5)',
                borderRadius: 1,
                zIndex: 1001,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'copy',
                transition: 'all 0.2s ease',
                animation: dropTarget === MAIN_LEVEL_DROP_ID ? 'mainLevelActive 1s infinite' : 'none',
                '@keyframes mainLevelActive': {
                  '0%': { 
                    bgcolor: 'rgba(255, 152, 0, 0.2)',
                    borderColor: '#ff9800'
                  },
                  '50%': { 
                    bgcolor: 'rgba(255, 152, 0, 0.3)',
                    borderColor: '#ffb74d'
                  },
                  '100%': { 
                    bgcolor: 'rgba(255, 152, 0, 0.2)',
                    borderColor: '#ff9800'
                  }
                }
              }}
            >
              <Typography sx={{ 
                fontSize: '9px', 
                color: '#ff9800', 
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.1,
                writingMode: 'vertical-rl',
                textOrientation: 'mixed'
              }}>
                Poziom główny
              </Typography>
            </Box>
          )}
          
          {filteredWarstwy.map(warstwa => renderWarstwaItem(warstwa))}
        </Box>

        {/* Panel właściwości w sidebarze - zawsze widoczny */}
        <Box
          sx={{
            flexShrink: 0,
            bgcolor: 'rgba(50, 50, 50, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            height: '200px',
            overflow: 'hidden'
          }}
        >
          {/* Nagłówek panelu właściwości */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              bgcolor: 'rgba(40, 40, 40, 0.9)'
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontSize: '15px',
                fontWeight: 500,
                flex: 1
              }}
            >
              {selectedLayer 
                ? `Właściwości ${selectedLayer.typ === 'grupa' ? 'grupy' : 'warstwy'}`
                : 'Właściwości projektu'
              }
            </Typography>
            {selectedLayer && (
              <IconButton
                size="small"
                onClick={() => setSelectedLayer(null)}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  p: 0.5,
                  '&:hover': { color: '#ff6b6b' }
                }}
              >
                <CloseIcon sx={{ fontSize: '14px' }} />
              </IconButton>
            )}
          </Box>

          {/* Zawartość panelu właściwości */}
          <Box sx={{ flex: 1, p: 1.5, overflow: 'auto' }}>
            {selectedLayer ? (
              <>
                {/* WŁAŚCIWOŚCI GRUPY - gdy selectedLayer.typ === 'grupa' */}
                {selectedLayer.typ === 'grupa' ? (
                  <>
                    {/* Sekcja: Informacje ogólne - jak na screenie */}
                    <Box sx={{ mb: 0.8 }}>
                      <Box
                        onClick={() => toggleSection('grupa-informacje-ogolne')}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          mb: 0.5,
                          '&:hover': { color: '#4fc3f7' }
                        }}
                      >
                        {expandedSections['grupa-informacje-ogolne'] ? 
                          <ExpandMoreIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} /> :
                          <ChevronRightIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} />
                        }
                        <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 500 }}>
                          Informacje ogólne
                        </Typography>
                      </Box>
                      
                      {expandedSections['grupa-informacje-ogolne'] && (
                        <Box sx={{ ml: 2, mt: 1 }}>
                          <Box sx={{ mb: 0.8 }}>
                            <Typography sx={{ fontSize: '11px', color: 'white', mb: 0.5 }}>
                              Nazwa
                            </Typography>
                            <Typography sx={{ 
                              fontSize: '11px', 
                              color: 'white', 
                              fontStyle: 'italic',
                              lineHeight: 1.3
                            }}>
                              MIEJSCOWE PLANY ZAGOSPODAROWANIA PRZESTRZENNEGO
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography sx={{ fontSize: '11px', color: 'white', mb: 0.5 }}>
                              Grupa
                            </Typography>
                            <Typography sx={{ 
                              fontSize: '11px', 
                              color: 'white', 
                              fontStyle: 'italic'
                            }}>
                              {selectedLayer?.id ? (findParentGroup(warstwy, selectedLayer.id)?.nazwa || 'Grupa główna') : 'Grupa główna'}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {/* Sekcja: Pobieranie - jak na screenie z ikoną kłódki */}
                    <Box sx={{ mb: 0.8 }}>
                      <Box
                        onClick={() => toggleSection('grupa-pobieranie')}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          mb: 1,
                          '&:hover': { color: '#4fc3f7' }
                        }}
                      >
                        {expandedSections['grupa-pobieranie'] ? 
                          <ExpandMoreIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} /> :
                          <ChevronRightIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} />
                        }
                        <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 500 }}>
                          Pobieranie
                        </Typography>
                        {/* Ikona kłódki z Material-UI tooltipem */}
                        <Tooltip 
                          title="Poniższe funkcje dostępne są w trybie edycji po zalogowaniu"
                          placement="top"
                          arrow
                          enterDelay={0}
                          leaveDelay={0}
                        >
                          <LockIcon sx={{ 
                            ml: 1,
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            cursor: 'help'
                          }} />
                        </Tooltip>
                      </Box>
                      
                      {expandedSections['grupa-pobieranie'] && (
                        <Box sx={{ ml: 2, mt: 1 }}>
                          <Box
                            sx={{
                              bgcolor: 'rgba(70, 80, 90, 0.8)',
                              border: '1px solid rgba(100, 110, 120, 0.6)',
                              borderRadius: '4px',
                              px: 2,
                              py: 0.4,
                              cursor: 'pointer',
                              fontSize: '11px',
                              color: 'white',
                              fontWeight: 500,
                              textAlign: 'center',
                              width: 'fit-content',
                              '&:hover': {
                                bgcolor: 'rgba(79, 195, 247, 0.2)',
                                borderColor: 'rgba(79, 195, 247, 0.4)'
                              }
                            }}
                            onClick={() => console.log('Pobierz grupę')}
                          >
                            Grupa
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {/* Sekcja: Widoczność - jak na screenie */}
                    <Box sx={{ mb: 0.8 }}>
                      <Box
                        onClick={() => toggleSection('grupa-widocznosc')}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          mb: 1,
                          '&:hover': { color: '#4fc3f7' }
                        }}
                      >
                        {expandedSections['grupa-widocznosc'] ? 
                          <ExpandMoreIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} /> :
                          <ChevronRightIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} />
                        }
                        <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 500 }}>
                          Widoczność
                        </Typography>
                      </Box>
                      
                      {expandedSections['grupa-widocznosc'] && (
                        <Box sx={{ ml: 2, mt: 1 }}>
                          {/* Domyślne wyświetlanie grupy z checkboxem */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                            <Typography sx={{ fontSize: '11px', color: 'white' }}>
                              Domyślne wyświetlanie grupy
                            </Typography>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                borderRadius: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                bgcolor: checkboxStates.grupaDomyslneWyswietlanie ? 'rgba(79, 195, 247, 0.3)' : 'transparent',
                                '&:hover': {
                                  borderColor: '#4fc3f7'
                                }
                              }}
                              onClick={() => toggleCheckbox('grupaDomyslneWyswietlanie')}
                            >
                              {/* Checkmark - tylko gdy zaznaczone */}
                              {checkboxStates.grupaDomyslneWyswietlanie && (
                                <Box sx={{ 
                                  width: 8, 
                                  height: 4, 
                                  borderLeft: '2px solid white',
                                  borderBottom: '2px solid white',
                                  transform: 'rotate(-45deg)',
                                  mt: '-1px'
                                }} />
                              )}
                            </Box>
                          </Box>
                          
                          {/* Przycisk Zapisz */}
                          <Box
                            sx={{
                              bgcolor: 'rgba(70, 80, 90, 0.8)',
                              border: '1px solid rgba(100, 110, 120, 0.6)',
                              borderRadius: '4px',
                              px: 2,
                              py: 0.4,
                              cursor: 'pointer',
                              fontSize: '11px',
                              color: 'white',
                              fontWeight: 500,
                              textAlign: 'center',
                              width: 'fit-content',
                              '&:hover': {
                                bgcolor: 'rgba(79, 195, 247, 0.2)',
                                borderColor: 'rgba(79, 195, 247, 0.4)'
                              }
                            }}
                            onClick={() => console.log('Zapisz widoczność grupy')}
                          >
                            Zapisz
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {/* Sekcja: Informacje szczegółowe - jak na screenie */}
                    <Box sx={{ mb: 0.8 }}>
                      <Box
                        onClick={() => toggleSection('grupa-informacje-szczegolowe')}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          mb: 1,
                          '&:hover': { color: '#4fc3f7' }
                        }}
                      >
                        {expandedSections['grupa-informacje-szczegolowe'] ? 
                          <ExpandMoreIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} /> :
                          <ChevronRightIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} />
                        }
                        <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 500 }}>
                          Informacje szczegółowe
                        </Typography>
                      </Box>
                      
                      {expandedSections['grupa-informacje-szczegolowe'] && (
                        <Box sx={{ ml: 2, mt: 1 }}>
                          {/* Legenda z przyciskiem Pokaż */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: '11px', color: 'white' }}>
                              Legenda
                            </Typography>
                            <Box
                              sx={{
                                bgcolor: 'rgba(70, 80, 90, 0.8)',
                                border: '1px solid rgba(100, 110, 120, 0.6)',
                                borderRadius: '4px',
                                px: 2,
                                py: 0.4,
                                cursor: 'pointer',
                                fontSize: '11px',
                                color: 'white',
                                fontWeight: 500,
                                textAlign: 'center',
                                '&:hover': {
                                  bgcolor: 'rgba(79, 195, 247, 0.2)',
                                  borderColor: 'rgba(79, 195, 247, 0.4)'
                                }
                              }}
                              onClick={() => console.log('Pokaż legendę grupy')}
                            >
                              Pokaż
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </>
                ) : (
                  <>
                    {/* WŁAŚCIWOŚCI WARSTWY - gdy selectedLayer.typ !== 'grupa' (wektor/raster) */}
                    
                    {/* Sekcja: Informacje ogólne */}
                    <Box sx={{ mb: 0.8 }}>
                      <Box
                        onClick={() => toggleSection('warstwa-informacje-ogolne')}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          mb: 1,
                          '&:hover': { color: '#4fc3f7' }
                        }}
                      >
                        {expandedSections['warstwa-informacje-ogolne'] ? 
                          <ExpandMoreIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} /> :
                          <ChevronRightIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} />
                        }
                        <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 500 }}>
                          Informacje ogólne
                        </Typography>
                      </Box>
                      
                      {expandedSections['warstwa-informacje-ogolne'] && (
                        <Box sx={{ ml: 2, mt: 1 }}>
                          <Box sx={{ mb: 0.8 }}>
                            <Typography sx={{ fontSize: '11px', color: 'white', mb: 0.5 }}>
                              Nazwa
                            </Typography>
                            <Typography sx={{ 
                              fontSize: '11px', 
                              color: 'white', 
                              fontStyle: 'italic',
                              lineHeight: 1.3
                            }}>
                              {selectedLayer.nazwa}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mb: 0.8 }}>
                            <Typography sx={{ fontSize: '11px', color: 'white', mb: 0.5 }}>
                              Grupa
                            </Typography>
                            <Typography sx={{ 
                              fontSize: '11px', 
                              color: 'white', 
                              fontStyle: 'italic'
                            }}>
                              {selectedLayer.id ? (findParentGroup(warstwy, selectedLayer.id)?.nazwa || 'Brak grupy nadrzędnej') : 'Brak grupy nadrzędnej'}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mb: 0.8 }}>
                            <Typography sx={{ fontSize: '11px', color: 'white', mb: 0.5 }}>
                              Typ geometrii
                            </Typography>
                            <Typography sx={{ 
                              fontSize: '11px', 
                              color: 'white', 
                              fontStyle: 'italic'
                            }}>
                              Multi-polygon
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: '11px', color: 'white' }}>
                              Tabela atrybutów
                            </Typography>
                            <Box
                              sx={{
                                bgcolor: 'rgba(70, 80, 90, 0.8)',
                                border: '1px solid rgba(100, 110, 120, 0.6)',
                                borderRadius: '4px',
                                px: 2,
                                py: 0.4,
                                cursor: 'pointer',
                                fontSize: '11px',
                                color: 'white',
                                fontWeight: 500,
                                textAlign: 'center',
                                '&:hover': {
                                  bgcolor: 'rgba(79, 195, 247, 0.2)',
                                  borderColor: 'rgba(79, 195, 247, 0.4)'
                                }
                              }}
                              onClick={() => console.log('Pokaż tabelę atrybutów warstwy')}
                            >
                              Pokaż
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {/* Sekcja: Pobieranie */}
                    <Box sx={{ mb: 0.8 }}>
                      <Box
                        onClick={() => toggleSection('warstwa-pobieranie')}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          mb: 1,
                          '&:hover': { color: '#4fc3f7' }
                        }}
                      >
                        {expandedSections['warstwa-pobieranie'] ? 
                          <ExpandMoreIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} /> :
                          <ChevronRightIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} />
                        }
                        <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 500 }}>
                          Pobieranie
                        </Typography>
                        {/* Ikona kłódki z Material-UI tooltipem */}
                        <Tooltip 
                          title="Poniższe funkcje dostępne są w trybie edycji po zalogowaniu"
                          placement="top"
                          arrow
                          enterDelay={0}
                          leaveDelay={0}
                        >
                          <LockIcon sx={{ 
                            ml: 1,
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            cursor: 'help'
                          }} />
                        </Tooltip>
                      </Box>
                      
                      {expandedSections['warstwa-pobieranie'] && (
                        <Box sx={{ ml: 2, mt: 1 }}>
                          <Box
                            sx={{
                              bgcolor: 'rgba(70, 80, 90, 0.8)',
                              border: '1px solid rgba(100, 110, 120, 0.6)',
                              borderRadius: '4px',
                              px: 2,
                              py: 0.4,
                              cursor: 'pointer',
                              fontSize: '11px',
                              color: 'white',
                              fontWeight: 500,
                              textAlign: 'center',
                              width: 'fit-content',
                              '&:hover': {
                                bgcolor: 'rgba(79, 195, 247, 0.2)',
                                borderColor: 'rgba(79, 195, 247, 0.4)'
                              }
                            }}
                            onClick={() => console.log('Pobierz warstwę')}
                          >
                            Warstwa
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {/* Sekcja: Widoczność */}
                    <Box sx={{ mb: 0.8 }}>
                      <Box
                        onClick={() => toggleSection('warstwa-widocznosc')}
                        sx={{
                          display: 'flex',
                          alignItems:'center',
                          cursor: 'pointer',
                          mb: 1,
                          '&:hover': { color: '#4fc3f7' }
                        }}
                      >
                        {expandedSections['warstwa-widocznosc'] ? 
                          <ExpandMoreIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} /> :
                          <ChevronRightIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} />
                        }
                        <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 500 }}>
                          Widoczność
                        </Typography>
                      </Box>
                      
                      {expandedSections['warstwa-widocznosc'] && (
                        <Box sx={{ ml: 2, mt: 1 }}>
                          {/* Widoczność kolumn z przyciskiem Edytuj */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                            <Typography sx={{ fontSize: '11px', color: 'white' }}>
                              Widoczność kolumn
                            </Typography>
                            <Box
                              sx={{
                                bgcolor: 'rgba(70, 80, 90, 0.8)',
                                border: '1px solid rgba(100, 110, 120, 0.6)',
                                borderRadius: '4px',
                                px: 1.5,
                                py: 0.3,
                                cursor: 'pointer',
                                fontSize: '10px',
                                color: 'white',
                                fontWeight: 500,
                                textAlign: 'center',
                                '&:hover': {
                                  bgcolor: 'rgba(79, 195, 247, 0.2)',
                                  borderColor: 'rgba(79, 195, 247, 0.4)'
                                }
                              }}
                              onClick={() => console.log('Edytuj widoczność kolumn')}
                            >
                              Edytuj
                            </Box>
                          </Box>

                          {/* Domyślne wyświetlanie warstwy z checkboxem */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                            <Typography sx={{ fontSize: '11px', color: 'white' }}>
                              Domyślne wyświetlanie warstwy
                            </Typography>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                borderRadius: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                bgcolor: checkboxStates.warstwaDomyslneWyswietlanie ? 'rgba(79, 195, 247, 0.3)' : 'transparent',
                                '&:hover': {
                                  borderColor: '#4fc3f7'
                                }
                              }}
                              onClick={() => toggleCheckbox('warstwaDomyslneWyswietlanie')}
                            >
                              {/* Checkmark - tylko gdy zaznaczone */}
                              {checkboxStates.warstwaDomyslneWyswietlanie && (
                                <Box sx={{ 
                                  width: 8, 
                                  height: 4, 
                                  borderLeft: '2px solid white',
                                  borderBottom: '2px solid white',
                                  transform: 'rotate(-45deg)',
                                  mt: '-1px'
                                }} />
                              )}
                            </Box>
                          </Box>

                          {/* Widoczność od zadanej skali z pustym checkboxem */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                            <Typography sx={{ fontSize: '11px', color: 'white' }}>
                              Widoczność od zadanej skali
                            </Typography>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                borderRadius: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                bgcolor: checkboxStates.warstwaWidocznoscOdSkali ? 'rgba(79, 195, 247, 0.3)' : 'transparent',
                                '&:hover': {
                                  borderColor: '#4fc3f7'
                                }
                              }}
                              onClick={() => toggleCheckbox('warstwaWidocznoscOdSkali')}
                            >
                              {/* Checkmark - tylko gdy zaznaczone */}
                              {checkboxStates.warstwaWidocznoscOdSkali && (
                                <Box sx={{ 
                                  width: 8, 
                                  height: 4, 
                                  borderLeft: '2px solid white',
                                  borderBottom: '2px solid white',
                                  transform: 'rotate(-45deg)',
                                  mt: '-1px'
                                }} />
                              )}
                            </Box>
                          </Box>

                          {/* Widoczność w trybie opublikowanym z checkboxem */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                            <Typography sx={{ fontSize: '11px', color: 'white' }}>
                              Widoczność w trybie opublikowanym
                            </Typography>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                borderRadius: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                bgcolor: checkboxStates.warstwaWidocznoscTrybOpublikowany ? 'rgba(79, 195, 247, 0.3)' : 'transparent',
                                '&:hover': {
                                  borderColor: '#4fc3f7'
                                }
                              }}
                              onClick={() => toggleCheckbox('warstwaWidocznoscTrybOpublikowany')}
                            >
                              {/* Checkmark - tylko gdy zaznaczone */}
                              {checkboxStates.warstwaWidocznoscTrybOpublikowany && (
                                <Box sx={{ 
                                  width: 8, 
                                  height: 4, 
                                  borderLeft: '2px solid white',
                                  borderBottom: '2px solid white',
                                  transform: 'rotate(-45deg)',
                                  mt: '-1px'
                                }} />
                              )}
                            </Box>
                          </Box>

                          {/* Przycisk Zapisz */}
                          <Box
                            sx={{
                              bgcolor: 'rgba(70, 80, 90, 0.8)',
                              border: '1px solid rgba(100, 110, 120, 0.6)',
                              borderRadius: '4px',
                              px: 2,
                              py: 0.4,
                              cursor: 'pointer',
                              fontSize: '11px',
                              color: 'white',
                              fontWeight: 500,
                              textAlign: 'center',
                              width: 'fit-content',
                              mb: 1,
                              '&:hover': {
                                bgcolor: 'rgba(79, 195, 247, 0.2)',
                                borderColor: 'rgba(79, 195, 247, 0.4)'
                              }
                            }}
                            onClick={() => console.log('Zapisz ustawienia widoczności warstwy')}
                          >
                            Zapisz
                          </Box>

                          {/* Przezroczystość warstwy ze sliderem */}
                          <Box sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                              <Typography sx={{ fontSize: '11px', color: 'white' }}>
                                Przezroczystość warstwy
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Box
                                  sx={{
                                    bgcolor: 'rgba(70, 80, 90, 0.8)',
                                    border: '1px solid rgba(100, 110, 120, 0.6)',
                                    borderRadius: '4px',
                                    px: 1,
                                    py: 0.3,
                                    fontSize: '10px',
                                    color: 'white',
                                    minWidth: '30px',
                                    textAlign: 'center'
                                  }}
                                >
                                  60
                                </Box>
                                <Typography sx={{ fontSize: '10px', color: 'white' }}>
                                  %
                                </Typography>
                              </Box>
                            </Box>
                            
                            {/* Slider */}
                            <Box sx={{ position: 'relative', height: '6px', bgcolor: 'rgba(255, 255, 255, 0.3)', borderRadius: '3px' }}>
                              <Box
                                sx={{
                                  position: 'absolute',
                                  left: 0,
                                  top: 0,
                                  width: '60%',
                                  height: '100%',
                                  bgcolor: '#4fc3f7',
                                  borderRadius: '3px'
                                }}
                              />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  left: '60%',
                                  top: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  width: 14,
                                  height: 14,
                                  bgcolor: 'white',
                                  borderRadius: '50%',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    bgcolor: '#4fc3f7'
                                  }
                                }}
                                onClick={() => console.log('Zmień przezroczystość warstwy')}
                              />
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {/* Sekcja: Informacje szczegółowe */}
                    <Box sx={{ mb: 0.8 }}>
                      <Box
                        onClick={() => toggleSection('warstwa-informacje-szczegolowe')}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          mb: 1,
                          '&:hover': { color: '#4fc3f7' }
                        }}
                      >
                        {expandedSections['warstwa-informacje-szczegolowe'] ? 
                          <ExpandMoreIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} /> :
                          <ChevronRightIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} />
                        }
                        <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 500 }}>
                          Informacje szczegółowe
                        </Typography>
                      </Box>
                      
                      {expandedSections['warstwa-informacje-szczegolowe'] && (
                        <Box sx={{ ml: 2, mt: 1 }}>
                          {/* Legenda z przyciskiem Pokaż */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: '11px', color: 'white' }}>
                              Legenda
                            </Typography>
                            <Box
                              sx={{
                                bgcolor: 'rgba(70, 80, 90, 0.8)',
                                border: '1px solid rgba(100, 110, 120, 0.6)',
                                borderRadius: '4px',
                                px: 2,
                                py: 0.4,
                                cursor: 'pointer',
                                fontSize: '11px',
                                color: 'white',
                                fontWeight: 500,
                                textAlign: 'center',
                                '&:hover': {
                                  bgcolor: 'rgba(79, 195, 247, 0.2)',
                                  borderColor: 'rgba(79, 195, 247, 0.4)'
                                }
                              }}
                              onClick={() => console.log('Pokaż legendę warstwy')}
                            >
                              Pokaż
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {/* Sekcja: Styl warstwy - TYLKO DLA WARSTW, NIE DLA GRUP */}
                    <Box sx={{ mb: 0.8 }}>
                      <Box
                        onClick={() => toggleSection('warstwa-styl-warstwy')}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          mb: 1,
                          '&:hover': { color: '#4fc3f7' }
                        }}
                      >
                        {expandedSections['warstwa-styl-warstwy'] ? 
                          <ExpandMoreIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} /> :
                          <ChevronRightIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} />
                        }
                        <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 500 }}>
                          Styl warstwy
                        </Typography>
                        {/* Ikona kłódki z Material-UI tooltipem */}
                        <Tooltip 
                          title="Poniższe funkcje dostępne są w trybie edycji po zalogowaniu"
                          placement="top"
                          arrow
                          enterDelay={0}
                          leaveDelay={0}
                        >
                          <LockIcon sx={{ 
                            ml: 1,
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            cursor: 'help'
                          }} />
                        </Tooltip>
                      </Box>
                      
                      {expandedSections['warstwa-styl-warstwy'] && (
                        <Box sx={{ ml: 2, mt: 1 }}>
                          {/* 3 przyciski jak na screenie */}
                          <Box sx={{ display: 'flex', gap: 0.5, mb: 0.8, flexWrap: 'wrap' }}>
                            <Box
                              sx={{
                                bgcolor: 'rgba(70, 80, 90, 0.8)',
                                border: '1px solid rgba(100, 110, 120, 0.6)',
                                borderRadius: '4px',
                                px: 1.5,
                                py: 0.3,
                                cursor: 'pointer',
                                fontSize: '10px',
                                color: 'white',
                                fontWeight: 500,
                                minWidth: '60px',
                                textAlign: 'center',
                                '&:hover': {
                                  bgcolor: 'rgba(79, 195, 247, 0.2)',
                                  borderColor: 'rgba(79, 195, 247, 0.4)'
                                }
                              }}
                              onClick={handleEditLayerStyle}
                            >
                              Edytuj
                            </Box>
                            
                            <Box
                              sx={{
                                bgcolor: 'rgba(70, 80, 90, 0.8)',
                                border: '1px solid rgba(100, 110, 120, 0.6)',
                                borderRadius: '4px',
                                px: 1.5,
                                py: 0.3,
                                cursor: 'pointer',
                                fontSize: '10px',
                                color: 'white',
                                fontWeight: 500,
                                minWidth: '70px',
                                textAlign: 'center',
                                '&:hover': {
                                  bgcolor: 'rgba(79, 195, 247, 0.2)',
                                  borderColor: 'rgba(79, 195, 247, 0.4)'
                                }
                              }}
                              onClick={handleManageLayer}
                            >
                              Zarządzaj
                            </Box>
                            
                            <Box
                              sx={{
                                bgcolor: 'rgba(70, 80, 90, 0.8)',
                                border: '1px solid rgba(100, 110, 120, 0.6)',
                                borderRadius: '4px',
                                px: 1.5,
                                py: 0.3,
                                cursor: 'pointer',
                                fontSize: '10px',
                                color: 'white',
                                fontWeight: 500,
                                minWidth: '90px',
                                textAlign: 'center',
                                '&:hover': {
                                  bgcolor: 'rgba(79, 195, 247, 0.2)',
                                  borderColor: 'rgba(79, 195, 247, 0.4)'
                                }
                              }}
                              onClick={handleLayerLabeling}
                            >
                              Etykietowanie
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </>
                )}
              </>
            ) : (
              <>
                {/* Widok domyślny - Właściwości projektu */}
                <Box sx={{ mb: 0.8 }}>
                  <Box
                    onClick={() => toggleSection('uslugi')}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      mb: 1,
                      '&:hover': { color: '#4fc3f7' }
                    }}
                  >
                    {expandedSections['uslugi'] ? 
                      <ExpandMoreIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} /> :
                      <ChevronRightIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} />
                    }
                    <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 500 }}>
                      Usługi
                    </Typography>
                  </Box>
                  
                  {expandedSections['uslugi'] && (
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', mb: 1, fontStyle: 'italic' }}>
                        Brak udostępnionych usług
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ mb: 0.8 }}>
                  <Box
                    onClick={() => toggleSection('pobieranie')}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      mb: 1,
                      '&:hover': { color: '#4fc3f7' }
                    }}
                  >
                    {expandedSections['pobieranie'] ? 
                      <ExpandMoreIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} /> :
                      <ChevronRightIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} />
                    }
                    <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 500 }}>
                      Pobieranie
                    </Typography>
                  </Box>
                  
                  {expandedSections['pobieranie'] && (
                    <Box sx={{ ml: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Box
                        sx={{
                          bgcolor: 'rgba(79, 195, 247, 0.2)',
                          border: '1px solid rgba(79, 195, 247, 0.4)',
                          borderRadius: '4px',
                          px: 1.5,
                          py: 0.5,
                          cursor: 'pointer',
                          fontSize: '10px',
                          color: '#4fc3f7',
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: 'rgba(79, 195, 247, 0.3)',
                          }
                        }}
                        onClick={() => console.log('QGS/QGZ clicked')}
                      >
                        QGS/QGZ
                      </Box>
                      <Box
                        sx={{
                          bgcolor: 'rgba(79, 195, 247, 0.2)',
                          border: '1px solid rgba(79, 195, 247, 0.4)',
                          borderRadius: '4px',
                          px: 1.5,
                          py: 0.5,
                          cursor: 'pointer',
                          fontSize: '10px',
                          color: '#4fc3f7',
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: 'rgba(79, 195, 247, 0.3)',
                          }
                        }}
                        onClick={() => console.log('Zbiór APP clicked')}
                      >
                        Zbiór APP
                      </Box>
                      <Box
                        sx={{
                          bgcolor: 'rgba(79, 195, 247, 0.2)',
                          border: '1px solid rgba(79, 195, 247, 0.4)',
                          borderRadius: '4px',
                          px: 1.5,
                          py: 0.5,
                          cursor: 'pointer',
                          fontSize: '10px',
                          color: '#4fc3f7',
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: 'rgba(79, 195, 247, 0.3)',
                          }
                        }}
                        onClick={() => console.log('Metadane clicked')}
                      >
                        Metadane
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box sx={{ mb: 0.8 }}>
                  <Box
                    onClick={() => toggleSection('metadane')}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      mb: 1,
                      '&:hover': { color: '#4fc3f7' }
                    }}
                  >
                    {expandedSections['metadane'] ? 
                      <ExpandMoreIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} /> :
                      <ChevronRightIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} />
                    }
                    <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 500 }}>
                      Metadane
                    </Typography>
                  </Box>
                  
                  {expandedSections['metadane'] && (
                    <Box sx={{ ml: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Box
                        sx={{
                          bgcolor: 'rgba(156, 39, 176, 0.2)',
                          border: '1px solid rgba(156, 39, 176, 0.4)',
                          borderRadius: '4px',
                          px: 1.5,
                          py: 0.5,
                          cursor: 'pointer',
                          fontSize: '10px',
                          color: '#ab47bc',
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: 'rgba(156, 39, 176, 0.3)',
                          }
                        }}
                        onClick={() => console.log('Wyświetl clicked')}
                      >
                        Wyświetl
                      </Box>
                      <Box
                        sx={{
                          bgcolor: 'rgba(63, 81, 181, 0.2)',
                          border: '1px solid rgba(63, 81, 181, 0.4)',
                          borderRadius: '4px',
                          px: 1.5,
                          py: 0.5,
                          cursor: 'pointer',
                          fontSize: '10px',
                          color: '#5c6bc0',
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: 'rgba(63, 81, 181, 0.3)',
                          }
                        }}
                        onClick={() => console.log('Wyszukaj clicked')}
                      >
                        Wyszukaj
                      </Box>
                      <Box
                        sx={{
                          bgcolor: 'rgba(76, 175, 80, 0.2)',
                          border: '1px solid rgba(76, 175, 80, 0.4)',
                          borderRadius: '4px',
                          px: 1.5,
                          py: 0.5,
                          cursor: 'pointer',
                          fontSize: '10px',
                          color: '#66bb6a',
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: 'rgba(76, 175, 80, 0.3)',
                          }
                        }}
                        onClick={() => console.log('Stwórz clicked')}
                      >
                        Stwórz
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box>
                  <Box
                    onClick={() => toggleSection('inne-projekty')}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover': { color: '#4fc3f7' }
                    }}
                  >
                    {expandedSections['inne-projekty'] ? 
                      <ExpandMoreIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} /> :
                      <ChevronRightIcon sx={{ fontSize: '14px', color: 'white', mr: 0.5 }} />
                    }
                    <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 500 }}>
                      Inne projekty użytkownika
                    </Typography>
                  </Box>
                  
                  {expandedSections['inne-projekty'] && (
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic' }}>
                        Brak innych projektów
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* Wybór mapy podkładowej na dole sidebara - pod panelem właściwości */}
        <Box
          sx={{
            flexShrink: 0,
            bgcolor: 'rgba(50, 50, 50, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            p: 1.5,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography sx={{ 
            fontSize: '11px', 
            fontWeight: 500, 
            color: 'white', 
            mb: 1 
          }}>
            Wybór mapy podkładowej
          </Typography>
          
          <TextField
            select
            defaultValue="google-maps"
            size="small"
            fullWidth
            onChange={(e) => console.log('Selected basemap:', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(40, 40, 40, 0.9)',
                color: 'white',
                fontSize: '10px',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4fc3f7',
                },
              },
              '& .MuiSelect-icon': {
                color: 'rgba(255, 255, 255, 0.6)',
              },
              '& .MuiInputBase-input': {
                padding: '6px 12px !important',
              }
            }}
          >
            <MenuItem value="google-maps" sx={{ fontSize: '10px' }}>
              Google Maps
            </MenuItem>
            <MenuItem value="openstreetmap" sx={{ fontSize: '10px' }}>
              OpenStreetMap
            </MenuItem>
            <MenuItem value="satellite" sx={{ fontSize: '10px' }}>
              Satelita
            </MenuItem>
            <MenuItem value="terrain" sx={{ fontSize: '10px' }}>
              Teren
            </MenuItem>
            <MenuItem value="hybrid" sx={{ fontSize: '10px' }}>
              Hybrydowa
            </MenuItem>
          </TextField>
          
          <Typography sx={{ 
            fontSize: '9px', 
            color: 'rgba(255, 255, 255, 0.6)', 
            mt: 1,
            fontWeight: 500,
            cursor: 'pointer',
            '&:hover': {
              color: '#4fc3f7'
            }
          }}>
            Rozpocznij poradnik
          </Typography>
        </Box>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          marginLeft: sidebarCollapsed ? 0 : 320,
          transition: 'margin-left 0.3s ease',
          position: 'relative'
        }}
      >
      </Box>


    </Box>
  );
}