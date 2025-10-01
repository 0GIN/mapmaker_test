# KONFIGURACJA TYPESCRIPT (tsconfig.json)

Ten plik zawiera konfigurację kompilatora TypeScript dla projektu Next.js.

## Sekcje konfiguracji:

### compilerOptions - Opcje kompilatora TypeScript

- **target**: "es5" - Docelowa wersja JavaScript (ES5 dla kompatybilności)
- **lib**: Biblioteki TypeScript do włączenia (DOM, iteratory, ES6)
- **allowJs**: true - Pozwala na importowanie plików .js
- **skipLibCheck**: true - Pomija sprawdzanie typów w bibliotekach
- **strict**: true - Włącza wszystkie ścisłe sprawdzenia TypeScript
- **noEmit**: true - Nie generuje plików .js (Next.js robi to sam)
- **esModuleInterop**: true - Lepsze wsparcie dla importów ES6/CommonJS
- **module**: "esnext" - Format modułów (najnowszy)
- **moduleResolution**: "bundler" - Strategia rozwiązywania modułów
- **jsx**: "preserve" - Zachowuje JSX (Next.js go przetworzy)
- **incremental**: true - Włącza kompilację przyrostową (szybsza)

### baseUrl i paths - Aliasy importów

- **@/***: Alias dla głównego folderu src/
- **@/components/***: Bezpośredni dostęp do komponentów
- **@/utils/***: Bezpośredni dostęp do utilities
- **@/hooks/***: Bezpośredni dostęp do custom hooks
- **@/lib/***: Bezpośredni dostęp do bibliotek
- **@/config/***: Bezpośredni dostęp do konfiguracji

### include - Pliki do sprawdzenia
Wszystkie pliki .ts, .tsx w folderach next-env.d.ts i src/

### exclude - Pliki do pominięcia
Folder node_modules (biblioteki zewnętrzne)