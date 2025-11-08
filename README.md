# Symulacja macOS w przeglądarce

Interaktywna, inspirowana macOS symulacja systemu operacyjnego, którą można uruchomić lokalnie w przeglądarce. Projekt odwzorowuje kluczowe elementy interfejsu: pasek menu, biurko z ikonami, Dock, okna z przyciskami sterującymi, tryb pełnoekranowy, a także panel ustawień pozwalający zmieniać tapetę.

## Funkcje

- realistyczny pasek menu z aktualizowanym zegarem w czasie rzeczywistym,
- Dock z animacjami, wskaźnikami uruchomionych aplikacji i prostą interakcją z ikoną kosza,
- okna aplikacji Finder, Notatki, Safari oraz Preferencje systemowe z przeciąganiem, minimalizacją i pseudo-trybem pełnoekranowym,
- okna są skalowalne dzięki uchwytom w prawym dolnym rogu, a po wyjściu z pełnego ekranu wracają do poprzednich wymiarów,
- Safari z paskiem adresu, historią nawigacji i możliwością odwiedzania prawdziwych stron dzięki lekkiej warstwie proxy,
- Terminal z historią poleceń, skrótami klawiszowymi oraz komendami do sterowania tapetami, trybem skupienia, powiadomieniami i muzyką,
- generatywny odtwarzacz Muzyka z listą utworów, trybem pętli/losowania i kontrolą głośności w Centrum sterowania,
- Kalendarz z nawigacją po miesiącach, wyróżnianiem dzisiejszej daty oraz listą nadchodzących wydarzeń,
- ikony na biurku otwierające aplikacje po pojedynczym kliknięciu, podwójnym kliknięciu lub z klawiatury,
- Quick Look w Finderze z podglądem plików (spacja, Enter lub podwójne kliknięcie) oraz przyciskiem szybkiego otwarcia,
- panel ustawień umożliwiający zmianę tapety z czterech wariantów,
- Centrum sterowania z kafelkami Wi‑Fi/Bluetooth/Skupienie, suwakami jasności oraz głośności i integracją z odtwarzaczem,
- Centrum powiadomień z kolejką wstrzymanych alertów podczas trybu skupienia i wskaźnikiem nieprzeczytanych w pasku menu,
- Spotlight wywoływany skrótem ⌘ + Spacja z wyszukiwaniem aplikacji, szybkimi akcjami Safari i poleceniami terminala,
- przełącznik aplikacji w stylu macOS wywoływany skrótem ⌘ + Tab z podglądem ikon i opisów,
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
