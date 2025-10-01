/**
 * KOMPONENT SIDEBAR - GŁÓWNY PANEL BOCZNY
 * 
 * Odpowiada za:
 * - Renderowanie głównego panelu bocznego aplikacji
 * - Organizację wszystkich komponentów UI (Toolbar, SearchBar, LayerTree, PropertiesPanel)
 * - Zarządzanie stanem rozwinięcia/zwinięcia sidebara
 * - Kompozycję wszystkich elementów interfejsu w jednym miejscu
 * - Przekazywanie props między komponentami child
 */
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { DragIndicator } from '@mui/icons-material';
import { SidebarProps } from '@/types/layers';
import { sidebarStyles } from '@/config/theme';
import { useResizable } from '@/hooks';
import { Toolbar } from './Toolbar';
import { SearchBar } from './SearchBar';
import { LayerTree } from './LayerTree';
import { PropertiesPanel } from './PropertiesPanel';
import { BasemapSelector } from './BasemapSelector';

export const Sidebar: React.FC<SidebarProps & { 
  onWidthChange?: (width: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
}> = ({
  collapsed,
  warstwy,
  selectedLayer,
  searchFilter,
  selectedFilter,
  filterMenuOpen,
  expandedSections,
  checkboxStates,
  dragDropState,
  selectedBasemap,
  onToggle,
  onWidthChange,
  onResizeStart,
  onResizeEnd,
  onLayerSelect,
  onToggleVisibility,
  onToggleExpansion,
  onSearchChange,
  onFilterChange,
  onFilterMenuToggle,
  onExpandAll,
  onCollapseAll,
  onToggleSection,
  onToggleCheckbox,
  onClosePanelSelection,
  onEditLayerStyle,
  onManageLayer,
  onLayerLabeling,
  onBasemapChange,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onDropAtEnd,
  onLayerTreeDragOver,
  onMainLevelDragOver,
  findParentGroup,
  // Toolbar props
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
  // Hook do zarządzania szerokością sidebara
  const { width, isResizing, handleMouseDown } = useResizable({
    initialWidth: sidebarStyles.width,
    minWidth: 250,
    maxWidth: 500,
    onResize: onWidthChange,
    onResizeStart: onResizeStart,
    onResizeEnd: onResizeEnd
  });

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: collapsed ? -width : 0,
        height: '100vh',
        width: width,
        bgcolor: sidebarStyles.background,
        boxShadow: collapsed ? 'none' : sidebarStyles.boxShadow,
        transition: isResizing ? 'none' : 'left 0.3s ease',
        zIndex: 1200,
        borderRight: collapsed ? 'none' : sidebarStyles.borderRight,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header z tytułem i toolbarem */}
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

        {/* Toolbar z 9 ikonami */}
        <Toolbar
          onAddInspireDataset={onAddInspireDataset}
          onAddNationalLaw={onAddNationalLaw}
          onAddLayer={onAddLayer}
          onImportLayer={onImportLayer}
          onAddGroup={onAddGroup}
          onRemoveLayer={onRemoveLayer}
          onCreateConsultation={onCreateConsultation}
          onLayerManager={onLayerManager}
          onPrintConfig={onPrintConfig}
        />

        {/* SearchBar */}
        <SearchBar
          searchFilter={searchFilter}
          onSearchChange={onSearchChange}
          selectedFilter={selectedFilter}
          onFilterChange={onFilterChange}
          filterMenuOpen={filterMenuOpen}
          onFilterMenuToggle={onFilterMenuToggle}
          onExpandAll={onExpandAll}
          onCollapseAll={onCollapseAll}
        />
      </Box>

      {/* Kontener dla listy warstw i panelu właściwości */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {/* LayerTree */}
        <LayerTree
          warstwy={warstwy}
          selectedLayer={selectedLayer}
          searchFilter={searchFilter}
          dragDropState={dragDropState}
          onLayerSelect={onLayerSelect}
          onToggleVisibility={onToggleVisibility}
          onToggleExpansion={onToggleExpansion}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDropAtEnd={onDropAtEnd}
          onLayerTreeDragOver={onLayerTreeDragOver}
          onMainLevelDragOver={onMainLevelDragOver}
        />

        {/* PropertiesPanel */}
        <PropertiesPanel
          selectedLayer={selectedLayer}
          warstwy={warstwy}
          expandedSections={expandedSections}
          checkboxStates={checkboxStates}
          onToggleSection={onToggleSection}
          onToggleCheckbox={onToggleCheckbox}
          onClosePanel={onClosePanelSelection}
          onEditLayerStyle={onEditLayerStyle}
          onManageLayer={onManageLayer}
          onLayerLabeling={onLayerLabeling}
          findParentGroup={findParentGroup}
        />

        {/* BasemapSelector */}
        <BasemapSelector
          selectedBasemap={selectedBasemap}
          onBasemapChange={onBasemapChange}
        />
      </Box>

      {/* Uchwyt do zmiany rozmiaru - pionowy pasek po prawej stronie */}
      {!collapsed && (
        <Box
          onMouseDown={handleMouseDown}
          sx={{
            position: 'absolute',
            top: 0,
            right: -2,
            width: 4,
            height: '100%',
            cursor: 'ew-resize',
            bgcolor: 'transparent',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
            zIndex: 1201,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Wizualny wskaźnik możliwości przeciągnięcia */}
          <Box
            sx={{
              width: 2,
              height: 40,
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 1,
              opacity: isResizing ? 1 : 0.5,
              transition: 'opacity 0.2s ease'
            }}
          />
        </Box>
      )}
    </Box>
  );
};
