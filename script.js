const timeElement = document.querySelector('.status-left .time');
const dateElement = document.querySelector('.status-left .date');
const controlToggle = document.querySelector('.control-center-toggle');
const notificationToggle = document.querySelector('.notification-center-toggle');
const controlCenter = document.querySelector('.control-center');
const notificationCenter = document.querySelector('.notification-center');
const toggles = document.querySelectorAll('.toggle');
const quickActions = document.querySelectorAll('.quick-actions button');
const logList = document.querySelector('.log-entries');
const apps = document.querySelectorAll('.app, .dock-app');
const modal = document.querySelector('.app-modal');
const modalTitle = document.querySelector('#app-title');
const modalContent = document.querySelector('.modal-content');
const closeModalButton = document.querySelector('.close-modal');

const intlDate = new Intl.DateTimeFormat('pl-PL', {
  weekday: 'short',
  day: '2-digit',
  month: 'short'
});

const intlTime = new Intl.DateTimeFormat('pl-PL', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

function updateClock() {
  const now = new Date();
  timeElement.textContent = intlTime.format(now);
  const formatted = intlDate.format(now);
  dateElement.textContent = formatted.replace(',', '').replace('.', '');
}

setInterval(updateClock, 30_000);
updateClock();

function togglePanel(panel, toggleButton) {
  const isHidden = panel.getAttribute('aria-hidden') !== 'false';
  const expanded = !isHidden;
  panel.setAttribute('aria-hidden', String(!isHidden));
  toggleButton.setAttribute('aria-expanded', String(!expanded));
}

controlToggle.addEventListener('click', () => {
  togglePanel(controlCenter, controlToggle);
  notificationCenter.setAttribute('aria-hidden', 'true');
  notificationToggle.setAttribute('aria-expanded', 'false');
});

notificationToggle.addEventListener('click', () => {
  togglePanel(notificationCenter, notificationToggle);
  controlCenter.setAttribute('aria-hidden', 'true');
  controlToggle.setAttribute('aria-expanded', 'false');
});

function logEvent(message) {
  const entry = document.createElement('li');
  entry.textContent = `${new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} — ${message}`;
  logList.prepend(entry);
  const entries = logList.querySelectorAll('li');
  if (entries.length > 8) {
    entries[entries.length - 1].remove();
  }
}

toggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const pressed = toggle.getAttribute('aria-pressed') === 'true';
    toggle.setAttribute('aria-pressed', String(!pressed));
    const name = toggle.dataset.toggle;
    const state = pressed ? 'wyłączono' : 'włączono';
    logEvent(`${state} ${name}`);
  });
});

quickActions.forEach((actionButton) => {
  actionButton.addEventListener('click', () => {
    const action = actionButton.dataset.action;
    const messages = {
      focus: 'Tryb skupienia aktywowany — powiadomienia wyciszone.',
      travel: 'Tryb podróży — pobrano aktualizację eSIM i map offline.',
      gaming: 'Tryb gier ProMotion+ — odblokowano 144 Hz w grach wspieranych.'
    };
    logEvent(messages[action] ?? 'Akcja wykonana.');
  });
});

const appContent = {
  messages: {
    title: 'Wiadomości',
    body: '<p>Nowa konwersacja z Anną. Inteligentne podsumowanie: <strong>Plan na weekend</strong>. Sugestia: zarezerwuj bilety na koncert.</p>'
  },
  calendar: {
    title: 'Kalendarz',
    body: '<p>Dzisiejsze wydarzenia:<br>• 10:00 – Spotkanie projektowe (FaceTime).<br>• 13:30 – Lunch z zespołem.<br>• 18:00 – Trening biegowy.</p>'
  },
  photos: {
    title: 'Zdjęcia',
    body: '<p>Galeria wspomnień automatycznie utworzyła album <strong>Weekend w Tatrach</strong>. Zobacz najlepsze ujęcia w HDR+.</p>'
  },
  music: {
    title: 'Muzyka',
    body: '<p>Teraz odtwarzane: <em>Above the Clouds</em> — Visionary Sounds. Dźwięk przestrzenny w trybie Adaptacyjnego Audio.</p>'
  },
  maps: {
    title: 'Mapy',
    body: '<p>Najkrótsza trasa do domu: 18 minut. Ruch drogowy normalny, proponowany przystanek w ulubionej kawiarni.</p>'
  },
  health: {
    title: 'Zdrowie',
    body: '<p>Tętno spoczynkowe: 58 BPM. Trend HRV poprawia się od 5 dni. Czas snu: 7h 45m.</p>'
  },
  'app-store': {
    title: 'App Store',
    body: '<p>Polecane aplikacje: <strong>Canvas AR</strong>, <strong>FlowTasks 5</strong>, <strong>Mindful Breaths</strong>. Wszystkie zoptymalizowane pod iOS 26.</p>'
  },
  settings: {
    title: 'Ustawienia',
    body: '<p>Nowe opcje eksperymentalne: Dynamiczne motywy, Inteligentne Siri Suggestions, Wzmocniona prywatność lokalizacji.</p>'
  },
  phone: {
    title: 'Telefon',
    body: '<p>Ostatnie połączenie: Jan Nowak (5 min temu). Sugestia AI: Wyślij wiadomość follow-up.</p>'
  },
  safari: {
    title: 'Safari',
    body: '<p>Otwarta karta: „Nowości w iOS 26”. Tryb bez rozpraszania aktywny, inteligentne grupowanie kart.</p>'
  },
  mail: {
    title: 'Mail',
    body: '<p>Priorytetowe: Oferta WWDC 2026. Siri podpowiada odpowiedź w 3 zdaniach i załącza wcześniejsze notatki.</p>'
  }
};

function openApp(appId) {
  const data = appContent[appId];
  if (!data) {
    logEvent(`Uruchomiono aplikację ${appId}`);
    return;
  }
  modalTitle.textContent = data.title;
  modalContent.innerHTML = data.body;
  modal.showModal();
  logEvent(`Uruchomiono aplikację ${data.title}`);
}

apps.forEach((appButton) => {
  appButton.addEventListener('click', () => {
    const appId = appButton.dataset.app;
    openApp(appId);
  });
});

closeModalButton.addEventListener('click', () => {
  modal.close();
});

modal.addEventListener('cancel', (event) => {
  event.preventDefault();
  modal.close();
});

function cycleWeather() {
  const temperatures = [19, 21, 23, 18];
  const conditions = ['Słonecznie', 'Pochmurnie', 'Lekki deszcz', 'Wieczorne przejaśnienia'];
  const index = Math.floor(Date.now() / (1000 * 60 * 60)) % temperatures.length;
  document.querySelector('.weather .value').textContent = temperatures[index];
  document.querySelector('.weather .conditions').textContent = conditions[index];
}

cycleWeather();
setInterval(cycleWeather, 60_000);

logEvent('System iOS 26 Boot — wszystkie moduły działają poprawnie.');
