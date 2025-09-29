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
    console.log('Drag started:', id); // Debug
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleDragEnter = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== id) {
      setDropTarget(id);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Sprawdź czy naprawdę opuszczamy element
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropTarget(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    console.log('Drop on:', targetId, 'from:', draggedItem); // Debug
    if (!draggedItem || draggedItem === targetId) {
      setDropTarget(null);
      return;
    }

    // Funkcja do znajdowania i usuwania elementu z całej struktury
    const findAndRemove = (items: Warstwa[], id: string): { found: Warstwa | null, newItems: Warstwa[] } => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          const found = items[i];
          const newItems = [...items];
          newItems.splice(i, 1);
          return { found, newItems };
        }
        
        if (items[i].dzieci && items[i].dzieci!.length > 0) {
          const result = findAndRemove(items[i].dzieci!, id);
          if (result.found) {
            const newItems = [...items];
            newItems[i] = { ...newItems[i], dzieci: result.newItems };
            return { found: result.found, newItems };
          }
        }
      }
      return { found: null, newItems: items };
    };

    // Funkcja do wstawiania elementu w odpowiednie miejsce
    const insertAt = (items: Warstwa[], targetId: string, itemToInsert: Warstwa): Warstwa[] => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === targetId) {
          const newItems = [...items];
          newItems.splice(i, 0, itemToInsert);
          return newItems;
        }
        
        if (items[i].dzieci && items[i].dzieci!.length > 0) {
          const result = insertAt(items[i].dzieci!, targetId, itemToInsert);
          if (result !== items[i].dzieci!) {
            const newItems = [...items];
            newItems[i] = { ...newItems[i], dzieci: result };
            return newItems;
          }
        }
      }
      return items;
    };

    // Usuń element z obecnej pozycji
    const removeResult = findAndRemove(warstwy, draggedItem);
    
    if (removeResult.found) {
      // Wstaw element przed targetet
      const newWarstwy = insertAt(removeResult.newItems, targetId, removeResult.found);
      console.log('Reordering successful'); // Debug
      setWarstwy(newWarstwy);
    } else {
      console.log('Failed to find dragged item'); // Debug
    }

    setDraggedItem(null);
    setDropTarget(null);
  };

  const renderWarstwaItem = (warstwa: Warstwa, level: number = 0): React.ReactNode => {
    const isDragged = draggedItem === warstwa.id;
    const isDropTarget = dropTarget === warstwa.id;
    
    return (
      <Box key={warstwa.id} sx={{ mb: 0, position: 'relative' }}>
        {/* Drop indicator - linia pokazująca gdzie zostanie upuszczona warstwa */}
        {isDropTarget && draggedItem && (
          <Box
            sx={{
              position: 'absolute',
              top: -2,
              left: level * 1.5 * 8 + 8,
              right: 8,
              height: 4,
              bgcolor: '#4fc3f7',
              borderRadius: 2,
              zIndex: 10,
              animation: 'pulse 1s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 0.6 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.6 }
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
          onDragOver={handleDragOver}
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
            <Tooltip title="Kalendarz" arrow>
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
                <Tooltip title="Planeta Ziemia" arrow>
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
                
                <Tooltip title="Mapa Polski" arrow>
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
                
                <Tooltip title="Dodaj element" arrow>
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
                
                <Tooltip title="Strzałka w górę" arrow>
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
                
                <Tooltip title="Plus" arrow>
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
                
                <Tooltip title="Zamknij" arrow>
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
                
                <Tooltip title="Komentarze" arrow>
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
                
                <Tooltip title="Gwiazda" arrow>
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
                
                <Tooltip title="Edytuj" arrow>
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
                  <Tooltip title="Filtruj warstwy" arrow>
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