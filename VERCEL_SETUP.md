# Instrukcja wdrożenia na Vercel – krok po kroku

## Krok 1 – Podłącz repozytorium do Vercel

1. Wejdź na **https://vercel.com** i zaloguj się (lub utwórz konto).
2. Kliknij **"Add New… → Project"**.
3. Wybierz **"Import Git Repository"**.
4. Wybierz repozytorium **KubaDdk/yoga002** z listy i kliknij **"Import"**.
5. Na ekranie konfiguracji:
   - **Framework Preset**: zostaw `Other`
   - **Root Directory**: zostaw `.` (bez zmian)
   - **Build & Output Settings**: zostaw domyślne (nic nie wpisuj)
6. Kliknij **"Deploy"**.

Vercel wdroży stronę i nada jej adres np. `yoga002.vercel.app`.

---

## Krok 2 – Przygotuj konto Gmail do wysyłania emaili

Strona używa Gmaila jako serwera SMTP. Musisz wygenerować **Hasło aplikacji** (App Password) – to specjalne hasło tylko dla tej aplikacji, które NIE jest Twoim głównym hasłem do Google.

### Jak wygenerować Hasło aplikacji Google:

1. Zaloguj się na konto Google, z którego chcesz wysyłać emaile (może to być Twoje prywatne lub nowe konto stworzone dla studia).
2. Wejdź na: **https://myaccount.google.com/security**
3. Upewnij się, że **Weryfikacja dwuetapowa (2FA)** jest **włączona** – bez niej hasła aplikacji nie działają.
   - Jeśli nie jest włączona: kliknij "Weryfikacja dwuetapowa" i przejdź przez krótki proces konfiguracji.
4. Po włączeniu 2FA wróć na stronę Security i wyszukaj **"App passwords"** (Hasła aplikacji) – lub wejdź bezpośrednio na: **https://myaccount.google.com/apppasswords**
5. W polu **"App name"** wpisz: `Little Yogini`
6. Kliknij **"Create"**.
7. Google wyświetli **16-znakowe hasło** (np. `abcd efgh ijkl mnop`). **Skopiuj je od razu** – nie zostanie pokazane ponownie.
8. To hasło będzie wartością zmiennej `SMTP_PASS` poniżej.

---

## Krok 3 – Ustaw zmienne środowiskowe w Vercel

1. W panelu Vercel przejdź do swojego projektu.
2. Kliknij **"Settings"** (górne menu).
3. Po lewej kliknij **"Environment Variables"**.
4. Dodaj każdą poniższą zmienną klikając **"Add New"**:

| Nazwa zmiennej | Wartość | Opis |
|---|---|---|
| `SMTP_HOST` | `smtp.gmail.com` | Serwer Gmail |
| `SMTP_PORT` | `587` | Port dla TLS |
| `SMTP_SECURE` | `false` | Zostaw false dla portu 587 |
| `SMTP_USER` | `twoj.adres@gmail.com` | Adres Gmail z którego wysyłasz |
| `SMTP_PASS` | `abcdefghijklmnop` | **16-znakowe Hasło aplikacji** z kroku 2 (bez spacji) |
| `SMTP_FROM` | `twoj.adres@gmail.com` | Taki sam jak SMTP_USER |
| `OWNER_EMAIL` | `twoj.adres@gmail.com` | Adres na który chcesz otrzymywać powiadomienia o rezerwacjach |

> **Ważne:** W polu `SMTP_PASS` wpisz hasło aplikacji **bez spacji** – Google pokazuje je z odstępami (`abcd efgh ijkl mnop`), ale musisz wpisać `abcdefghijklmnop`.

5. Po dodaniu wszystkich 7 zmiennych kliknij **"Save"**.

---

## Krok 4 – Wdróż ponownie (redeploy)

Zmienne środowiskowe nie są automatycznie wczytywane przez istniejący deployment. Musisz wywołać nowe wdrożenie:

1. Przejdź do zakładki **"Deployments"**.
2. Kliknij trzy kropki (`…`) przy ostatnim deploymencie.
3. Wybierz **"Redeploy"** → **"Redeploy"** (potwierdź).

Vercel wdroży stronę ponownie z nowymi zmiennymi.

---

## Krok 5 – Przetestuj rezerwację

1. Otwórz swoją stronę (np. `https://yoga002.vercel.app`).
2. Kliknij **"Zarezerwuj miejsce"** w sekcji hero lub **"Rezerwacje"** w nawigacji.
3. Wybierz zajęcia (Czwartek 19:30 lub Niedziela 10:30).
4. Wpisz imię i nazwisko oraz **swój adres email** (do testu).
5. Kliknij **"Zarezerwuj miejsce"**.
6. Powinieneś/powinnaś zobaczyć zielony komunikat potwierdzenia i otrzymać email na podany adres.
7. Na adres z `OWNER_EMAIL` powinno przyjść powiadomienie o nowej rezerwacji.

---

## Rozwiązywanie problemów

### Email nie dochodzi
- Sprawdź folder **Spam/Śmieci** w skrzynce odbiorczej.
- Upewnij się, że `SMTP_PASS` jest wpisane **bez spacji**.
- Upewnij się, że na koncie Google włączona jest **Weryfikacja dwuetapowa**.
- Sprawdź logi błędów: Vercel Dashboard → projekt → zakładka **"Functions"** → kliknij `api/reserve` → **"View Function Logs"**.

### Strona się nie wczytuje / błąd 500
- Przejdź do Vercel Dashboard → **"Deployments"** → kliknij ostatni deployment → **"Build Logs"** – zobaczysz dokładny błąd.

### Dodawanie/zmiana zajęć w przyszłości
Edytuj plik `classes.json` w repozytorium GitHub – zmiana automatycznie wyzwoli nowy deployment na Vercel.

---

## Szybki cheatsheet – wartości dla Gmail

```
SMTP_HOST    = smtp.gmail.com
SMTP_PORT    = 587
SMTP_SECURE  = false
SMTP_USER    = twoj.email@gmail.com
SMTP_PASS    = (16 znaków z App Passwords, bez spacji)
SMTP_FROM    = twoj.email@gmail.com
OWNER_EMAIL  = adres@na.który.chcesz.dostawać.powiadomienia.com
```
