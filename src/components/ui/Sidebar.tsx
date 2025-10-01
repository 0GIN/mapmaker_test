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
import { Box, Typography } from '@mui/material';
import { SidebarProps } from '@/types/layers';
import { sidebarStyles } from '@/config/theme';
import { Toolbar } from './Toolbar';
import { SearchBar } from './SearchBar';
import { LayerTree } from './LayerTree';
import { PropertiesPanel } from './PropertiesPanel';
import { BasemapSelector } from './BasemapSelector';

export const Sidebar: React.FC<SidebarProps> = ({
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
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: collapsed ? -sidebarStyles.width : 0,
        height: '100vh',
        width: sidebarStyles.width,
        bgcolor: sidebarStyles.background,
        boxShadow: collapsed ? 'none' : sidebarStyles.boxShadow,
        transition: 'left 0.3s ease',
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
    </Box>
  );
};
