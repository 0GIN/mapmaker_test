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
  Divider
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
  Terrain as TerrainIcon
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
  const [warstwy, setWarstwy] = useState<Warstwa[]>([
    {
      id: 'grupa-1',
      nazwa: 'Działki i granice',
      widoczna: true,
      typ: 'grupa',
      rozwinięta: true,
      dzieci: [
        { id: 'dzialki-1', nazwa: 'Działki ewidencyjne', widoczna: true, typ: 'wektor' },
        { id: 'granice-1', nazwa: 'Granice działek', widoczna: false, typ: 'wektor' },
        { id: 'numery-1', nazwa: 'Numery działek', widoczna: true, typ: 'wektor' }
      ]
    },
    {
      id: 'grupa-2',
      nazwa: 'Planowanie przestrzenne',
      widoczna: true,
      typ: 'grupa',
      rozwinięta: false,
      dzieci: [
        { id: 'mpzp-1', nazwa: 'Miejscowe plany zagospodarowania', widoczna: true, typ: 'wektor' },
        { id: 'studium-1', nazwa: 'Studium uwarunkowań', widoczna: false, typ: 'raster' },
        { id: 'projekty-1', nazwa: 'Projekty planów', widoczna: false, typ: 'wektor' }
      ]
    },
    {
      id: 'grupa-3',
      nazwa: 'Infrastruktura',
      widoczna: false,
      typ: 'grupa',
      rozwinięta: false,
      dzieci: [
        { id: 'drogi-1', nazwa: 'Sieć drogowa', widoczna: true, typ: 'wektor' },
        { id: 'wodkan-1', nazwa: 'Sieć wod-kan', widoczna: false, typ: 'wektor' },
        { id: 'energia-1', nazwa: 'Linie energetyczne', widoczna: false, typ: 'wektor' }
      ]
    },
    { id: 'ortofoto-1', nazwa: 'Ortofotomapa', widoczna: true, typ: 'raster' },
    { id: 'budynki-1', nazwa: 'Budynki', widoczna: true, typ: 'wektor' },
    { id: 'tereny-1', nazwa: 'Tereny chronione', widoczna: false, typ: 'wektor' }
  ]);

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

  const getWarstwaIcon = (typ: Warstwa['typ']) => {
    switch (typ) {
      case 'grupa': return <FolderIcon />;
      case 'wektor': return <LayersIcon />;
      case 'raster': return <TerrainIcon />;
      default: return <LayersIcon />;
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

  const renderWarstwaItem = (warstwa: Warstwa, level: number = 0): React.ReactNode => (
    <Box key={warstwa.id} sx={{ mb: 0.25 }}>
      <Box
        className="layer-item"
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 0.75,
          ml: level * 2,
          borderRadius: 1,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          bgcolor: 'transparent',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            '& .layer-item__actions': {
              opacity: 1
            }
          }
        }}
      >
        {warstwa.typ === 'grupa' && (
          <IconButton
            size="small"
            onClick={() => toggleWarstwaExpansion(warstwa.id)}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              p: 0.25,
              mr: 0.5,
              transform: warstwa.rozwinięta ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        )}
        
        <Box
          component="input"
          type="checkbox"
          checked={warstwa.widoczna}
          onChange={() => toggleWarstwaVisibility(warstwa.id)}
          sx={{
            mr: 1,
            cursor: 'pointer',
            accentColor: '#1976d2'
          }}
        />
        
        <Box sx={{ color: 'white', mr: 1, display: 'flex', alignItems: 'center' }}>
          {getWarstwaIcon(warstwa.typ)}
        </Box>
        
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: warstwa.widoczna ? 'white' : 'rgba(255, 255, 255, 0.6)',
            flex: 1,
            fontWeight: warstwa.typ === 'grupa' ? 600 : 400
          }}
        >
          {warstwa.nazwa}
        </Typography>
        
        <Box
          className="layer-item__actions"
          sx={{
            display: 'flex',
            gap: 0.25,
            opacity: 0,
            transition: 'opacity 0.2s ease'
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Settings for:', warstwa.nazwa);
            }}
            sx={{ color: 'rgba(255, 255, 255, 0.6)', p: 0.25 }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Opacity for:', warstwa.nazwa);
            }}
            sx={{ color: 'rgba(255, 255, 255, 0.6)', p: 0.25 }}
          >
            <OpacityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Zoom to:', warstwa.nazwa);
            }}
            sx={{ color: 'rgba(255, 255, 255, 0.6)', p: 0.25 }}
          >
            <ZoomInMapIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
      {warstwa.dzieci && warstwa.rozwinięta && (
        <Box sx={{ ml: 1 }}>
          {warstwa.dzieci.map(dziecko => renderWarstwaItem(dziecko, level + 1))}
        </Box>
      )}
    </Box>
  );

  const filteredWarstwy = filterWarstwy(warstwy, searchFilter);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1
        }}
      />
      
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: sidebarCollapsed ? 70 : 320,
          bgcolor: 'rgba(38, 50, 56, 0.85)',
          backdropFilter: 'blur(8px)',
          transition: 'width 0.3s ease',
          zIndex: 1200,
          borderRight: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Box className="layer-panel__header" sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {!sidebarCollapsed && (
            <Box sx={{ mb: 2 }}>
              <Box
                component="input"
                type="text"
                placeholder="Szukaj warstw..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                sx={{
                  width: '100%',
                  p: 1,
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.875rem',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.6)'
                  },
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#1976d2'
                  }
                }}
              />
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {!sidebarCollapsed && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={() => console.log('Dodaj warstwę')}
                  sx={{
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => console.log('Zapisz stan')}
                  sx={{
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  <SaveIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => console.log('Filtruj warstwy')}
                  sx={{
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  <FilterListIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            
            <IconButton
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'rotate(180deg)'
                },
                transition: 'all 0.3s'
              }}
            >
              {sidebarCollapsed ? <MenuIcon /> : <CloseIcon />}
            </IconButton>
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
          {!sidebarCollapsed && filteredWarstwy.map(warstwa => renderWarstwaItem(warstwa))}
          
          {sidebarCollapsed && warstwy.map(warstwa => (
            <Box
              key={warstwa.id}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                p: 1,
                mb: 1,
                borderRadius: 1,
                bgcolor: warstwa.widoczna ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
              onClick={() => toggleWarstwaVisibility(warstwa.id)}
            >
              <Box sx={{ color: 'white' }}>
                {getWarstwaIcon(warstwa.typ)}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          marginLeft: sidebarCollapsed ? '70px' : '320px',
          transition: 'margin-left 0.3s ease',
          position: 'relative'
        }}
      >
      </Box>
    </Box>
  );
}