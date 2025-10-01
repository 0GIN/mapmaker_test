// ===================================================================
// KONFIGURACJA TEMATU MATERIAL-UI
// ===================================================================
// Ten plik definiuje customowy temat dla całej aplikacji
// Zawiera: kolory, typografię, style komponentów i inne ustawienia wizualne

'use client';

import { createTheme } from '@mui/material/styles';

// ===================================================================
// GŁÓWNY TEMAT APLIKACJI - Centralna konfiguracja wyglądu
// ===================================================================
export const theme = createTheme({
  
  // ===================================================================
  // PALETA KOLORÓW - Definiuje główne kolory aplikacji
  // ===================================================================
  palette: {
    mode: 'light',        // Tryb jasny (alternatywa: 'dark')
    
    // Kolory główne (przyciski, linki, akcenty)
    primary: {
      main: '#1976d2',    // Główny niebieski
      light: '#42a5f5',   // Jaśniejszy odcień
      dark: '#1565c0',    // Ciemniejszy odcień
    },
    
    // Kolory drugorzędne (elementy pomocnicze)
    secondary: {
      main: '#dc004e',    // Główny różowy/czerwony
      light: '#ff5983',   // Jaśniejszy odcień
      dark: '#9a0036',    // Ciemniejszy odcień
    },
    
    // Kolory tła
    background: {
      default: '#f5f5f5', // Tło całej aplikacji (szare)
      paper: '#ffffff',   // Tło kart i paneli (białe)
    },
  },

  // ===================================================================
  // TYPOGRAFIA - Ustawienia fontów i tekstów
  // ===================================================================
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Główny font
    
    // Style nagłówków (h1, h2, h3)
    h1: { fontWeight: 500 },   // Średnia grubość czcionki
    h2: { fontWeight: 500 },
    h3: { fontWeight: 500 },
  },

  // ===================================================================
  // CUSTOMIZACJA KOMPONENTÓW - Nadpisywanie domyślnych stylów MUI
  // ===================================================================
  components: {
    
    // Stylowanie przycisków
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Wyłącza CAPS w tekście przycisków
          borderRadius: 8,       // Lekko zaokrąglone rogi
        },
      },
    },
    
    // Stylowanie kart/paneli
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,                        // Bardziej zaokrąglone rogi
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Subtelny cień
        },
      },
    },
  },
});