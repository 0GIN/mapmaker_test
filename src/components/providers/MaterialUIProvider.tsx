// ===================================================================
// PROVIDER MATERIAL-UI - Dostawca tematu i stylów globalnych
// ===================================================================
// Ten komponent opakowuje całą aplikację w kontekst Material-UI
// Zapewnia dostęp do tematu, resetuje style przeglądarki i konfiguruje MUI

'use client'; // Komponent kliencki (potrzebny dla Material-UI)

// ===================================================================
// IMPORTY MATERIAL-UI - Główne komponenty do zarządzania tematem
// ===================================================================
import { ThemeProvider } from '@mui/material/styles'; // Provider tematu MUI
import CssBaseline from '@mui/material/CssBaseline';  // Reset stylów CSS
import { theme } from '@/config/theme';               // Nasz customowy temat

// ===================================================================
// MATERIALUI PROVIDER COMPONENT
// ===================================================================
// Główny provider który:
// 1. Dostarcza customowy temat do całej aplikacji
// 2. Resetuje domyślne style przeglądarki (CssBaseline)
// 3. Zapewnia spójność stylów między komponentami MUI
export default function MaterialUIProvider({
  children,
}: {
  children: React.ReactNode; // Wszystkie komponenty potomne aplikacji
}) {
  return (
    <ThemeProvider theme={theme}>
      {/* 
        CssBaseline - normalizuje style CSS między przeglądarkami:
        - Usuwa marginesy i paddingi
        - Ustawia spójne fonty
        - Resetuje style formularzy
        - Zapewnia lepsze defaultowe style
      */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}