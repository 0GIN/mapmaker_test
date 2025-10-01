/**
 * KOMPONENT TOOLBAR - PASEK NARZĘDZI
 * 
 * Odpowiada za:
 * - Renderowanie paska narzędzi z ikonami akcji
 * - Obsługę głównych funkcji aplikacji (dodawanie warstw, eksport, import)
 * - Zarządzanie akcjami na mapie (zoom, reset widoku, pomiary)
 * - Przełączanie trybu edycji/podglądu
 * - Shortcuts do najważniejszych funkcjonalności
 * - Tooltips z opisami narzędzi
 */
import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
  Public as PublicIcon,
  Map as MapIcon,
  AddBox as AddBoxIcon,
  ArrowUpward as ArrowUpwardIcon,
  Add as AddIcon,
  Clear as ClearIcon,
  Chat as ChatIcon,
  Star as StarIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { ToolbarProps } from '@/types/layers';

export const Toolbar: React.FC<ToolbarProps> = ({
  onAddInspireDataset,
  onAddNationalLaw,
  onAddLayer,
  onImportLayer,
  onAddGroup,
  onRemoveLayer,
  onCreateConsultation,
  onLayerManager,
  onPrintConfig
}) => {
  return (
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
          onClick={onAddInspireDataset}
          className="toolbar-icon"
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
      
      <Tooltip title="Dodaj zbiór danych - PRAWO KRAJOWE" arrow>
        <IconButton
          size="small"
          onClick={onAddNationalLaw}
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
      
      <Tooltip title="Dodaj warstwę" arrow>
        <IconButton
          size="small"
          onClick={onAddLayer}
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
      
      <Tooltip title="Importuj warstwę" arrow>
        <IconButton
          size="small"
          onClick={onImportLayer}
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
          onClick={onAddGroup}
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
          onClick={onRemoveLayer}
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
          onClick={onCreateConsultation}
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
          onClick={onLayerManager}
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
          onClick={onPrintConfig}
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
  );
};
