/**
 * KOMPONENT SEARCH BAR - PASEK WYSZUKIWANIA I FILTROWANIA
 * 
 * Odpowiada za:
 * - Wyszukiwanie warstw po nazwie (live search)
 * - Filtrowanie warstw według typu (grupa, wektor, raster, WMS)
 * - Menu filtrów z checkboxami dla różnych typów
 * - Czyszczenie filtrów i wyszukiwania
 * - Podświetlanie aktywnych filtrów
 * - Responsywny design (kompaktowy widok na małych ekranach)
 */
import React, { useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
  FilterList as FilterListIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { SearchBarProps } from '@/types/layers';

export const SearchBar: React.FC<SearchBarProps> = ({
  searchFilter,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  filterMenuOpen,
  onFilterMenuToggle,
  onExpandAll,
  onCollapseAll
}) => {
  // Zamknij menu filtrowania przy kliknięciu poza nim
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuOpen) {
        onFilterMenuToggle();
      }
    };

    if (filterMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [filterMenuOpen, onFilterMenuToggle]);

  return (
    <Box sx={{ mb: -1 }}>
      {/* Kontener z przyciskami i polem wyszukiwania */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
        {/* Przycisk po lewej stronie */}
        <Box sx={{ position: 'relative' }}>
          <Tooltip title="Widoczność warstw" arrow>
            <IconButton
              size="small"
              onClick={onFilterMenuToggle}
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
                    onFilterChange(option.key as any);
                    onFilterMenuToggle();
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
          onChange={(e: any) => onSearchChange(e.target.value)}
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
            onClick={onExpandAll}
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
            onClick={onCollapseAll}
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
  );
};
