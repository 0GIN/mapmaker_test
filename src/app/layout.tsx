// ===================================================================
// GŁÓWNY LAYOUT APLIKACJI (Root Layout)
// ===================================================================
// Ten plik definiuje podstawową strukturę HTML dla całej aplikacji Next.js
// Jest to najwyższy poziom w hierarchii layoutów - wrap dla wszystkich stron

import type { Metadata } from 'next';
import MaterialUIProvider from '@/components/providers/MaterialUIProvider';
import './globals.css';

// ===================================================================
// METADATA - Konfiguracja SEO i informacji o stronie
// ===================================================================
// Definiuje tytuł i opis strony widoczne w przeglądarce i wyszukiwarkach
export const metadata: Metadata = {
  title: 'MapMaker Test - Next.js with Material-UI',
  description: 'A modern web application built with Next.js, TypeScript, and Material-UI',
};

// ===================================================================
// ROOT LAYOUT COMPONENT - Główny komponent layoutu
// ===================================================================
// Opakowuje wszystkie strony aplikacji w podstawową strukturę HTML
// children - to wszystkie komponenty/strony które będą renderowane wewnątrz
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Ładowanie ikon Material Design z Google Fonts */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        {/* Biblioteka SortableJS do przeciągania i upuszczania elementów */}
        <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
      </head>
      <body>
        {/* 
          MaterialUIProvider - opakowuje całą aplikację w kontekst Material-UI
          Zapewnia dostęp do tematu, stylów i komponentów MUI w całej aplikacji
        */}
        <MaterialUIProvider>
          {children}
        </MaterialUIProvider>
      </body>
    </html>
  );
}