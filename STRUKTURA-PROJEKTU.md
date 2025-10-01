# 📁 STRUKTURA PROJEKTU MAPMAKER - KOMPLETNY PRZEWODNIK

## 🎯 Cel aplikacji
Aplikacja do zarządzania warstwami map z interfejsem drag-and-drop, panelem właściwości i filtrowaniem.

---

## 📂 STRUKTURA FOLDERÓW I PLIKÓW

### 🏠 **Główny folder projektu**
```
mapmaker_test-5/
├── 📄 package.json          # Zależności i skrypty npm
├── 📄 next.config.js        # Konfiguracja Next.js
├── 📄 tsconfig.json         # Konfiguracja TypeScript
├── 📄 README.md             # Dokumentacja projektu
└── 📁 src/                  # Kod źródłowy aplikacji
```

### 🔧 **Pliki konfiguracyjne - Co robią:**

- **`package.json`** - Lista wszystkich bibliotek i narzędzi, skrypty do uruchamiania
- **`next.config.js`** - Ustawienia Next.js (kompilacja, optymalizacja)
- **`tsconfig.json`** - Konfiguracja TypeScript (aliasy, sprawdzanie typów)

---

## 📁 **src/ - Kod źródłowy**

### 🎨 **src/app/ - Strony aplikacji (Next.js App Router)**
```
src/app/
├── 📄 layout.tsx            # Główny layout (HTML, head, providers)
├── 📄 page.tsx              # Strona główna z całym interfejsem
└── 📄 globals.css           # Globalne style CSS
```

**Co robi każdy plik:**
- **`layout.tsx`** - Opakowuje całą aplikację, ładuje fonty, Material-UI
- **`page.tsx`** - GŁÓWNA LOGIKA: sidebar, warstwy, drag&drop, panel właściwości  
- **`globals.css`** - Reset stylów, podstawowe style aplikacji

### 🧩 **src/components/ - Komponenty UI**
```
src/components/
├── 📁 layout/               # Komponenty layoutu
│   ├── 📄 Header.tsx        # Nagłówek aplikacji
│   └── 📄 Footer.tsx        # Stopka aplikacji
├── 📁 providers/            # Dostawcy kontekstu
│   └── 📄 MaterialUIProvider.tsx  # Provider Material-UI (temat, style)
└── 📁 ui/                   # Komponenty interfejsu
    ├── 📄 ErrorState.tsx    # Komponent wyświetlania błędów
    ├── 📄 LoadingCard.tsx   # Karta z loadingiem  
    └── 📄 LoadingState.tsx  # Stan ładowania (spinner)
```

### 🎣 **src/hooks/ - Custom Hooks (logika biznesowa)**
```
src/hooks/
├── 📄 index.ts              # Eksport wszystkich hooks
├── 📄 useLayersApi.ts       # Hook do komunikacji z API warstw
└── 📄 useOptimisticLayers.ts # Hook do optymistycznych aktualizacji
```

**Co robią hooks:**
- **`useLayersApi.ts`** - Pobieranie, aktualizacja, zarządzanie warstwami przez API
- **`useOptimisticLayers.ts`** - Natychmiastowe aktualizacje UI (bez czekania na API)

### ⚙️ **src/config/ - Konfiguracja**
```
src/config/
└── 📄 theme.ts              # Temat Material-UI (kolory, fonty, style)
```

### 🛠️ **src/lib/ - Biblioteki i utilities**
```
src/lib/
└── 📄 api.ts                # Klient API (GET, POST, PUT, DELETE)
```

### 🏷️ **src/types/ - Definicje TypeScript**
```
src/types/
└── 📄 index.ts              # Interfejsy i typy aplikacji
```

### 🔧 **src/utils/ - Funkcje pomocnicze**
```
src/utils/
└── 📄 index.ts              # Funkcje utility (formatowanie, walidacja)
```

---

## 🔄 **PRZEPŁYW DANYCH W APLIKACJI**

### 1. **Uruchomienie aplikacji**
```
layout.tsx (HTML + MaterialUI) → page.tsx (główny interface)
```

### 2. **Ładowanie warstw**
```
page.tsx → useLayersApi → api.ts → Backend → Wyświetlenie w sidebar
```

### 3. **Interakcje użytkownika**
```
Klik na warstwę → Aktualizacja stanu → useOptimisticLayers → UI update
Drag & Drop → Sortowanie → API update → Synchronizacja
```

### 4. **Zarządzanie błędami**
```
API error → ErrorState.tsx → Wyświetlenie błędu + przycisk retry
```

---

## 🎨 **SYSTEM STYLÓW I TEMATÓW**

### Material-UI Theme System:
1. **`theme.ts`** - Definicje kolorów, fontów, komponentów
2. **`MaterialUIProvider.tsx`** - Dostarczanie tematu do aplikacji  
3. **`CssBaseline`** - Reset stylów przeglądarek
4. **Komponenty MUI** - Używają tematu automatycznie

---

## 🧠 **KLUCZOWE CONCEPTY**

### **Hooks Pattern:**
- Logika biznesowa oddzielona od komponentów UI
- Reużywalne funkcje stanu i efektów
- Łatwe testowanie i utrzymanie

### **Optimistic Updates:**  
- UI aktualizuje się natychmiast
- API wywołuje się w tle
- W razie błędu - rollback do poprzedniego stanu

### **TypeScript Integration:**
- Bezpieczeństwo typów w całej aplikacji
- Autocompletowanie i refactoring
- Łapanie błędów na etapie kompilacji

### **Material-UI Design System:**
- Spójny wygląd i działanie
- Gotowe komponenty UI
- Responsywność i accessibility

---

## 🔧 **JAK DODAĆ NOWĄ FUNKCJONALNOŚĆ**

### 1. **Nowy komponent UI:**
```
src/components/ui/NowyKomponent.tsx
```

### 2. **Nowa logika biznesowa:**
```  
src/hooks/useNowaFunkcjonalnosc.ts
```

### 3. **Nowe typy danych:**
```
src/types/index.ts (dodać interface)
```

### 4. **Nowe API endpoint:**
```
src/lib/api.ts (dodać metodę)
```

### 5. **Nowe style/kolory:**
```
src/config/theme.ts (aktualizować temat)
```

---

## 🎛️ **ZMIENNE ŚRODOWISKOWE**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api  # URL backendu
```

---

## 📝 **NAJWAŻNIEJSZE PLIKI DO EDYCJI**

1. **`src/app/page.tsx`** - Główna logika aplikacji
2. **`src/hooks/useLayersApi.ts`** - Komunikacja z backendem  
3. **`src/config/theme.ts`** - Wygląd aplikacji
4. **`src/lib/api.ts`** - Klient HTTP
5. **`src/types/index.ts`** - Struktury danych