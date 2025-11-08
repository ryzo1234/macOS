# Symulacja macOS w przeglądarce

Interaktywna, inspirowana macOS symulacja systemu operacyjnego, którą można uruchomić lokalnie w przeglądarce. Projekt odwzorowuje kluczowe elementy interfejsu: pasek menu, biurko z ikonami, Dock, okna z przyciskami sterującymi, tryb pełnoekranowy, a także panel ustawień pozwalający zmieniać tapetę.

## Funkcje

- realistyczny pasek menu z aktualizowanym zegarem w czasie rzeczywistym,
- Dock z animacjami, wskaźnikami uruchomionych aplikacji i prostą interakcją z ikoną kosza,
- okna aplikacji Finder, Notatki, Safari oraz Preferencje systemowe z przeciąganiem, minimalizacją i pseudo-trybem pełnoekranowym,
- ikony na biurku otwierające aplikacje po podwójnym kliknięciu,
- panel ustawień umożliwiający zmianę tapety z kilku wariantów,
- responsywny układ oraz wsparcie dla preferencji motywu (jasny/ciemny).

## Uruchomienie lokalne

1. Uruchom prosty serwer HTTP, np. przy pomocy Pythona:

   ```bash
   python -m http.server 8000
   ```

2. Otwórz w przeglądarce adres [http://localhost:8000](http://localhost:8000) i wybierz plik `index.html`.

Możesz również otworzyć plik `index.html` bezpośrednio w przeglądarce, jednak uruchomienie przez serwer zapewnia poprawne działanie wszystkich funkcji w środowiskach z zaostrzonymi politykami bezpieczeństwa.

## Struktura projektu

```
macOS/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Licencja

Projekt został stworzony wyłącznie w celach demonstracyjnych. Nazwy i elementy wyglądu inspirowane systemem macOS należą do Apple Inc.
