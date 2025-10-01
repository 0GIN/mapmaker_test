/**
 * KOMPONENT BASEMAP SELECTOR - SELEKTOR MAP PODKŁADOWYCH
 * 
 * Odpowiada za:
 * - Wybór mapy podkładowej (OpenStreetMap, Satellite, Terrain)
 * - Wyświetlanie listy dostępnych map bazowych
 * - Przełączanie między różnymi dostawcami map
 * - Ustawienia jakości i poziomu detali mapy
 * - Interface do konfiguracji mapy bazowej
 */
import React from 'react';
import { Box, Typography, TextField, MenuItem } from '@mui/material';
import { BasemapSelectorProps } from '@/types/layers';

export const BasemapSelector: React.FC<BasemapSelectorProps> = ({
  selectedBasemap,
  onBasemapChange
}) => {
  return (
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
        value={selectedBasemap}
        size="small"
        fullWidth
        onChange={(e) => onBasemapChange(e.target.value)}
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
  );
};
