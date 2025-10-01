// ===================================================================
// KONFIGURACJA NEXT.JS
// ===================================================================
// Główny plik konfiguracyjny aplikacji Next.js
// Zawiera ustawienia kompilacji, optymalizacji i integracji

/** @type {import('next').NextConfig} */
const nextConfig = {
  
  // ===================================================================
  // KONFIGURACJA KOMPILATORA - Ustawienia budowania aplikacji
  // ===================================================================
  compiler: {
    // Włącza wsparcie dla Emotion CSS-in-JS (używane przez Material-UI)
    // Emotion to biblioteka do stylowania komponentów w React
    emotion: true,
  },
  
  // Tutaj można dodać więcej konfiguracji:
  // - images: optymalizacja obrazów
  // - experimental: eksperymentalne funkcje
  // - env: zmienne środowiskowe
  // - redirects: przekierowania URL
  // - headers: custom nagłówki HTTP
}

module.exports = nextConfig