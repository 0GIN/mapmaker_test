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
  Tooltip
} from '@mui/material';
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
  ViewList as ViewListIcon
} from '@mui/icons-material';

interface Warstwa {
  id: string;
  nazwa: string;
  widoczna: boolean;
  typ: 'grupa' | 'wektor' | 'raster';
  dzieci?: Warstwa[];
  rozwinięta?: boolean;
}

declare global {
  interface Window {
    Sortable: any;
  }
}

export default function HomePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after'>('before');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'wszystko' | 'wektor' | 'raster' | 'wms'>('wszystko');
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

  const toggleWarstwaVisibility = (id: string) => {
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

  const toggleWarstwaExpansion = (id: string) => {
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

  const getWarstwaIcon = (typ: Warstwa['typ'], id?: string) => {
    switch (typ) {
      case 'grupa': return <FolderIcon sx={{ color: '#4fc3f7' }} />; // Niebieska ikona folderu dla katalogów
      case 'wektor': return <LayersIcon sx={{ color: '#81c784' }} />; // Zielona ikona dla warstw wektorowych
      case 'raster': return <LayersIcon sx={{ color: '#81c784' }} />; // Zielona ikona dla warstw rastrowych
      default: return <LayersIcon sx={{ color: '#81c784' }} />; // Domyślnie zielona ikona warstwy
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

  const handleDragStart = (e: React.DragEvent, id: string) => {
    console.log('🟢 Drag started:', id);
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTarget(null);
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
    
    // Aktualizuj pozycję drop w czasie rzeczywistym podczas przeciągania
    if (draggedItem && id && id !== draggedItem) {
      const isValidTarget = !isDescendant(draggedItem, id);
      if (isValidTarget) {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseY = e.clientY;
        const elementMiddle = rect.top + rect.height / 2;
        
        const position = mouseY < elementMiddle ? 'before' : 'after';
        
        if (dropTarget !== id || dropPosition !== position) {
          setDropTarget(id);
          setDropPosition(position);
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔴 DROP EVENT FIRED! Target:', targetId, 'Dragged:', draggedItem);
    
    if (!draggedItem || draggedItem === targetId) {
      console.log('❌ Invalid drop - same element or no dragged item');
      setDropTarget(null);
      return;
    }

    // Prosta funkcja reorderowania - działa rekursywnie na całej strukturze
    const reorderItemsInTree = (items: Warstwa[]): Warstwa[] => {
      // Sprawdź czy oba elementy są na tym poziomie
      const draggedIndex = items.findIndex(item => item.id === draggedItem);
      const targetIndex = items.findIndex(item => item.id === targetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Oba elementy są na tym poziomie - reorder
        const newItems = [...items];
        const [draggedElement] = newItems.splice(draggedIndex, 1);
        
        // Wstaw przed lub po targecie w zależności od dropPosition
        let insertIndex;
        if (dropPosition === 'before') {
          insertIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
        } else { // 'after'
          insertIndex = draggedIndex < targetIndex ? targetIndex : targetIndex + 1;
        }
        
        newItems.splice(insertIndex, 0, draggedElement);
        
        console.log(`Reordered at level: moved ${draggedItem} ${dropPosition} ${targetId}`);
        return newItems;
      }
      
      // Jeśli nie ma na tym poziomie, sprawdź dzieci
      return items.map(item => ({
        ...item,
        dzieci: item.dzieci ? reorderItemsInTree(item.dzieci) : undefined
      }));
    };

    const newWarstwy = reorderItemsInTree(warstwy);
    console.log('🟡 Old warstwy:', warstwy);
    console.log('🟠 New warstwy:', newWarstwy);
    console.log('🔵 Are they different?', JSON.stringify(warstwy) !== JSON.stringify(newWarstwy));
    
    if (JSON.stringify(warstwy) !== JSON.stringify(newWarstwy)) {
      setWarstwy(newWarstwy);
      console.log('✅ State updated successfully');
    } else {
      console.log('❌ No change in state - reordering failed');
    }

    setDraggedItem(null);
    setDropTarget(null);
    setDropPosition('before');
  };

  const handleDropAtEnd = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedItem) {
      console.log('❌ No dragged item for end drop');
      return;
    }

    console.log(`🎯 Dropping at end of group: ${groupId}, dragged item: ${draggedItem}`);

    // Funkcja do przeniesienia elementu na koniec grupy
    const moveItemToEndOfGroup = (items: Warstwa[]): Warstwa[] => {
      const newItems = [...items];
      
      // Usuń przeciągnięty element z aktualnej pozycji
      const removeDraggedItem = (arr: Warstwa[]): Warstwa[] => {
        return arr.reduce((acc: Warstwa[], item) => {
          if (item.id === draggedItem) {
            // Pomijamy ten element (usuwamy go)
            return acc;
          }
          
          const newItem = {
            ...item,
            dzieci: item.dzieci ? removeDraggedItem(item.dzieci) : undefined
          };
          acc.push(newItem);
          return acc;
        }, []);
      };

      // Znajdź przeciągnięty element
      let draggedElement: Warstwa | null = null;
      const findDraggedElement = (arr: Warstwa[]): void => {
        arr.forEach(item => {
          if (item.id === draggedItem) {
            draggedElement = { ...item };
          }
          if (item.dzieci) {
            findDraggedElement(item.dzieci);
          }
        });
      };

      findDraggedElement(newItems);
      
      if (!draggedElement) {
        console.log('❌ Dragged element not found');
        return items;
      }

      // Usuń przeciągnięty element ze struktury
      const itemsWithoutDragged = removeDraggedItem(newItems);

      // Dodaj element na koniec odpowiedniej grupy
      const addToEndOfGroup = (arr: Warstwa[]): Warstwa[] => {
        return arr.map(item => {
          if (item.id === groupId) {
            // Znaleźliśmy docelową grupę - dodaj element na koniec jej dzieci
            const newChildren = item.dzieci ? [...item.dzieci] : [];
            newChildren.push(draggedElement!);
            return {
              ...item,
              dzieci: newChildren
            };
          }
          
          if (item.dzieci) {
            return {
              ...item,
              dzieci: addToEndOfGroup(item.dzieci)
            };
          }
          
          return item;
        });
      };

      return addToEndOfGroup(itemsWithoutDragged);
    };

    const newWarstwy = moveItemToEndOfGroup(warstwy);
    console.log('🟡 Old warstwy (end drop):', warstwy);
    console.log('🟠 New warstwy (end drop):', newWarstwy);
    console.log('🔵 Are they different (end drop)?', JSON.stringify(warstwy) !== JSON.stringify(newWarstwy));
    
    if (JSON.stringify(warstwy) !== JSON.stringify(newWarstwy)) {
      setWarstwy(newWarstwy);
      console.log('✅ End drop: State updated successfully');
    } else {
      console.log('❌ End drop: No change in state');
    }

    setDraggedItem(null);
    setDropTarget(null);
    setDropPosition('before');
  };

  const renderWarstwaItem = (warstwa: Warstwa, level: number = 0): React.ReactNode => {
    const isDragged = draggedItem === warstwa.id;
    const isDropTarget = dropTarget === warstwa.id;
    
    return (
      <Box key={warstwa.id} sx={{ mb: 0, position: 'relative' }}>
        {/* Drop indicator - precyzyjna linia pokazująca gdzie zostanie upuszczona warstwa */}
        {isDropTarget && draggedItem && (
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
          onDragStart={(e) => handleDragStart(e, warstwa.id)}
          onDragEnd={handleDragEnd}
          onDragEnter={(e) => handleDragEnter(e, warstwa.id)}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => handleDragOver(e, warstwa.id)}
          onDrop={(e) => handleDrop(e, warstwa.id)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 0.5,
            px: 1,
            ml: level * 1.5,
            borderRadius: 4,
            cursor: isDragged ? 'grabbing' : 'grab',
            transition: 'all 0.2s ease',
            bgcolor: isDragged ? 'rgba(79, 195, 247, 0.3)' : 
                     isDropTarget ? 'rgba(76, 175, 80, 0.2)' : 'transparent',
            borderLeft: level > 0 ? '2px solid rgba(255,255,255,0.1)' : 'none',
            border: isDragged ? '2px dashed #4fc3f7' : 
                    isDropTarget ? '2px solid #4caf50' : 'none',
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
        {/* Drag handle */}
        {warstwa.typ === 'grupa' && (
          <Box
            onClick={() => toggleWarstwaExpansion(warstwa.id)}
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
        )}
        
        <Box
          component="input"
          type="checkbox"
          checked={warstwa.widoczna}
          onChange={() => toggleWarstwaVisibility(warstwa.id)}
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
        
        <Typography
          sx={{
            fontSize: '13px',
            color: warstwa.widoczna ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
            flex: 1,
            fontWeight: warstwa.typ === 'grupa' ? 500 : 400,
            letterSpacing: '0.2px',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
          }}
        >
          {warstwa.nazwa}
        </Typography>
        
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
          {warstwa.dzieci.map(dziecko => renderWarstwaItem(dziecko, level + 1))}
          
          {/* Specjalna strefa drop na końcu grupy */}
          <Box
            onDragEnter={(e) => handleDragEnter(e, `${warstwa.id}-end`)}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropAtEnd(e, warstwa.id)}
            sx={{
              height: 20,
              position: 'relative',
              cursor: draggedItem ? 'copy' : 'default',
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
      {/* Tło z mapą jak Google Maps */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.05)),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8f5e8' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
            linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 25%, #e0f0e0 50%, #d5e7d5 75%, #c8e0c8 100%)
          `,
          backgroundSize: '60px 60px, 60px 60px, cover',
          backgroundPosition: '0 0, 30px 30px, center',
          zIndex: -1
        }}
      >
        {/* Dodajmy elementy map-like */}
        <Box sx={{ 
          position: 'absolute', 
          top: '20%', 
          left: '15%', 
          width: 8, 
          height: 8, 
          bgcolor: '#ff6b35', 
          borderRadius: '50%',
          '&::after': {
            content: '"Łódź"',
            position: 'absolute',
            top: -25,
            left: -15,
            fontSize: '12px',
            color: '#333',
            fontWeight: 500
          }
        }} />
        <Box sx={{ 
          position: 'absolute', 
          top: '45%', 
          left: '25%', 
          width: 6, 
          height: 6, 
          bgcolor: '#4fc3f7', 
          borderRadius: '50%',
          '&::after': {
            content: '"Częstochowa"',
            position: 'absolute',
            top: -25,
            left: -25,
            fontSize: '11px',
            color: '#555',
            fontWeight: 400
          }
        }} />
        <Box sx={{ 
          position: 'absolute', 
          top: '60%', 
          left: '45%', 
          width: 10, 
          height: 10, 
          bgcolor: '#e91e63', 
          borderRadius: '50%',
          '&::after': {
            content: '"Kraków"',
            position: 'absolute',
            top: -25,
            left: -15,
            fontSize: '12px',
            color: '#333',
            fontWeight: 500
          }
        }} />
        {/* Drogi/linie */}
        <Box sx={{
          position: 'absolute',
          top: '25%',
          left: '20%',
          width: '200px',
          height: '2px',
          bgcolor: '#90a4ae',
          transform: 'rotate(25deg)',
          opacity: 0.6
        }} />
        <Box sx={{
          position: 'absolute',
          top: '55%',
          left: '30%',
          width: '150px',
          height: '2px',
          bgcolor: '#90a4ae',
          transform: 'rotate(-15deg)',
          opacity: 0.6
        }} />
      </Box>
      
      {/* Toggle button - zawsze widoczny */}
      <IconButton
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        sx={{
          position: 'fixed',
          top: 20,
          left: sidebarCollapsed ? 20 : 340,
          zIndex: 1300,
          bgcolor: 'rgba(55, 60, 72, 0.9)',
          color: 'white',
          '&:hover': {
            bgcolor: 'rgba(79, 195, 247, 0.8)',
          },
          transition: 'left 0.3s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}
      >
        {sidebarCollapsed ? <MenuIcon /> : <CloseIcon />}
      </IconButton>

      {/* Lewy panel - chowający się z przezroczystym tłem */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: sidebarCollapsed ? -320 : 0,
          height: '100vh',
          width: 320,
          bgcolor: 'rgba(60, 60, 60, 0.9)',
          boxShadow: sidebarCollapsed ? 'none' : '2px 0 12px rgba(0,0,0,0.4)',
          transition: 'left 0.3s ease',
          zIndex: 1200,
          borderRight: sidebarCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Box className="layer-panel__header" sx={{ 
          p: 2, 
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          textAlign: 'center'
        }}>
          {/* Tytuł */}
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white', 
              mb: 2, 
              fontSize: '16px',
              fontWeight: 400,
              letterSpacing: '2px',
              textTransform: 'lowercase'
            }}
          >
            ogrodzieniecesip
          </Typography>

              {/* Toolbar z 9 ikonami w jednym rzędzie */}
              <Box sx={{ 
                display: 'flex', 
                gap: 0.5, 
                mb: 2,
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                px: 1
              }}>
                <Tooltip title="Dodaj zbiór danych - INSPIRE" arrow>
                  <IconButton
                    size="small"
                    onClick={() => console.log('Planeta Ziemia')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      p: 0.5,
                      minWidth: 'auto',
                      '&:hover': { color: '#4fc3f7' }
                    }}
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

            <Box sx={{ mb: 2 }}>
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
                        py: 1
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
                            py: 1.2,
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

        <Box 
          className="layer-tree"
          sx={{ 
            flex: 1,
            overflow: 'auto',
            p: 1,
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
          {filteredWarstwy.map(warstwa => renderWarstwaItem(warstwa))}
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