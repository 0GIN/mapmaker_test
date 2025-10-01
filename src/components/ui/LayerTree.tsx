/**
 * KOMPONENT LAYER TREE - DRZEWO WARSTW
 * 
 * Odpowiada za:
 * - Renderowanie hierarchicznej struktury warstw i grup
 * - Obsługę drag & drop między warstwami (przeciąganie, upuszczanie, wizualne wskazówki)
 * - Wyświetlanie ikon dla różnych typów warstw (grupa, warstwa)
 * - Zarządzanie rozwijaniem/zwijaniem grup
 * - Obsługę checkboxów włączania/wyłączania warstw
 * - Wizualne feedback podczas operacji drag & drop (strefy drop, kolory, animacje)
 */
import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import {
  Folder as FolderIcon,
  Layers as LayersIcon,
  ZoomInMap as ZoomInMapIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { LayerTreeProps, Warstwa } from '@/types/layers';
import { layerIconColors, dropZoneColors } from '@/config/theme';

const MAIN_LEVEL_DROP_ID = '__main_level__';

export const LayerTree: React.FC<LayerTreeProps> = ({
  warstwy,
  selectedLayer,
  searchFilter,
  dragDropState,
  onLayerSelect,
  onToggleVisibility,
  onToggleExpansion,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onDropAtEnd,
  onLayerTreeDragOver,
  onMainLevelDragOver
}) => {
  const { draggedItem, dropTarget, dropPosition, showMainLevelZone } = dragDropState;

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

  const renderWarstwaItem = (warstwa: Warstwa, level: number = 0): React.ReactNode => {
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
          onClick={() => onLayerSelect(warstwa.id)}
          onDragStart={(e) => onDragStart(e as any, warstwa.id)}
          onDragEnd={onDragEnd}
          onDragEnter={(e) => onDragEnter(e as any, warstwa.id)}
          onDragLeave={onDragLeave as any}
          onDragOver={(e) => onDragOver(e as any, warstwa.id)}
          onDrop={(e) => onDrop(e as any, warstwa.id)}
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
                onToggleExpansion(warstwa.id);
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
            onChange={() => onToggleVisibility(warstwa.id)}
            onClick={(e: any) => e.stopPropagation()}
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
            {warstwa.dzieci.map((dziecko: Warstwa) => renderWarstwaItem(dziecko, level + 1))}
            
            {/* Specjalna strefa drop na końcu grupy */}
            <Box
              onDragEnter={(e) => onDragEnter(e as any, `${warstwa.id}-end`)}
              onDragLeave={onDragLeave as any}
              onDragOver={onDragOver as any}
              onDrop={(e) => onDropAtEnd(e as any, warstwa.id)}
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
    <Box 
      className="layer-tree"
      onDragOver={onLayerTreeDragOver as any}
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
          onDragOver={onMainLevelDragOver as any}
          onDrop={(e) => onDrop(e as any, MAIN_LEVEL_DROP_ID)}
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
  );
};
