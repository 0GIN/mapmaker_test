# 🎛️ Przewodnik Konfiguracji Panelu Właściwości

## Lokalizacja
Wszystkie ustawienia wielkości i stylów znajdziesz w pliku:
```
src/components/ui/PropertiesPanel.tsx
```
Na początku pliku w sekcji `PANEL_CONFIG`.

## ⚡ Szybkie Zmiany

### 1. Zmiana wysokości panelu
```javascript
// W sekcji panel:
panel: {
  height: '300px', // zmień z '200px' na '300px'
}
```

### 2. Zmiana rozmiaru czcionek
```javascript
// W sekcji typography:
typography: {
  headerFontSize: '16px',      // tytuł panelu
  sectionTitleFontSize: '14px', // tytuły sekcji  
  labelFontSize: '12px',       // etykiety pól
  buttonFontSize: '11px',      // tekst przycisków
}
```

### 3. Zmiana odstępów między elementami
```javascript
// W sekcji elements:
elements: {
  sectionMarginBottom: 1.0,    // odstęp między sekcjami (1.0 = 8px)
  fieldMarginBottom: 1.0,      // odstęp między polami (1.0 = 8px)  
  buttonMinWidth: '70px',      // minimalna szerokość przycisków
}
```

### 4. Zmiana kolorów (motyw)
```javascript
// W sekcji colors:
colors: {
  accent: '#ff9800',           // kolor akcentowy (pomarańczowy)
  panelBackground: 'rgba(60, 45, 30, 0.95)', // tło panelu
  text: '#fff3e0',            // kolor tekstu
}
```

## 🚀 Gotowe Konfiguracje

### Kompaktowy Panel (mały)
```javascript
panel: { height: '150px', headerHeight: '32px' },
elements: { sectionMarginBottom: 0.5, fieldMarginBottom: 0.5, buttonMinWidth: '50px' },
typography: { headerFontSize: '14px', sectionTitleFontSize: '13px', labelFontSize: '10px' },
```

### Duży Panel (przestronny)  
```javascript
panel: { height: '350px', headerHeight: '55px' },
elements: { sectionMarginBottom: 1.5, fieldMarginBottom: 1.2, buttonMinWidth: '80px' },
typography: { headerFontSize: '17px', sectionTitleFontSize: '16px', labelFontSize: '12px' },
```

### Bardzo Duży Panel (maksymalny)
```javascript
panel: { height: '450px', headerHeight: '65px' },
elements: { sectionMarginBottom: 2.0, fieldMarginBottom: 1.5, buttonMinWidth: '90px' },
typography: { headerFontSize: '18px', sectionTitleFontSize: '17px', labelFontSize: '13px' },
```

## 🎨 Gotowe Motywy Kolorystyczne

### Motyw Niebieski
```javascript
colors: {
  accent: '#2196f3',
  panelBackground: 'rgba(30, 40, 60, 0.95)',
  headerBackground: 'rgba(20, 30, 50, 0.9)',
  text: '#e3f2fd'
}
```

### Motyw Zielony
```javascript
colors: {
  accent: '#4caf50',
  panelBackground: 'rgba(40, 60, 40, 0.95)', 
  headerBackground: 'rgba(30, 50, 30, 0.9)',
  text: '#e8f5e8'
}
```

### Motyw Pomarańczowy  
```javascript
colors: {
  accent: '#ff9800',
  panelBackground: 'rgba(60, 45, 30, 0.95)',
  headerBackground: 'rgba(50, 35, 20, 0.9)', 
  text: '#fff3e0'
}
```

## 📏 Jednostki Material-UI

- **Liczby** (np. `1.0`, `2.5`) = pomnożone przez 8px
  - `0.5` = 4px
  - `1.0` = 8px  
  - `1.5` = 12px
  - `2.0` = 16px

- **Stringi** (np. `'200px'`, `'16px'`) = dokładne wartości w pikselach

## 🔧 Jak Zastosować Zmiany

1. Otwórz plik `src/components/ui/PropertiesPanel.tsx`
2. Znajdź sekcję `PANEL_CONFIG` na początku
3. Zmień wybrane wartości
4. Zapisz plik - zmiany zastosują się automatycznie
5. Sprawdź efekt w przeglądarce na `http://localhost:3001`

## ⚠️ Uwagi

- Zachowaj składnię JavaScript (przecinki, cudzysłowy)
- Testuj zmiany na małej skali przed większymi modyfikacjami  
- Jeśli coś się zepsuje, przywróć poprzednie wartości
- Wysokość panelu `height` wpływa na ilość widocznych sekcji

## 💡 Wskazówki

- Dla mniejszych ekranów użyj kompaktowej konfiguracji
- Dla dużych monitorów zwiększ wysokość panelu do 300-400px
- Eksperymentuj z kolorami - zmień tylko `accent` dla szybkiego efektu
- Wszystkie zmiany są natychmiastowo widoczne w trybie deweloperskim