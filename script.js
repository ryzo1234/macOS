const clockElement = document.getElementById('menuClock');
const wallpaperElement = document.querySelector('.wallpaper');
const desktop = document.getElementById('desktop');
const dock = document.getElementById('dock');
const settingsTemplate = document.getElementById('settings-template');
const controlCenter = document.querySelector('[data-control-center]');
const controlToggle = document.querySelector('[data-control-toggle]');
const controlClose = controlCenter?.querySelector('[data-control-close]');
const brightnessSlider = controlCenter?.querySelector('[data-brightness]');
const volumeSlider = controlCenter?.querySelector('[data-volume]');
const notificationCenter = document.querySelector('[data-notification-center]');
const notificationToggle = document.querySelector('[data-notification-toggle]');
const notificationList = notificationCenter?.querySelector('[data-notification-list]');
const notificationClear = notificationCenter?.querySelector('[data-notification-clear]');
const spotlight = document.querySelector('[data-spotlight]');
const spotlightInput = spotlight?.querySelector('[data-spotlight-input]');
const spotlightResults = spotlight?.querySelector('[data-spotlight-results]');
const appSwitcher = document.querySelector('[data-app-switcher]');
const appSwitcherStrip = appSwitcher?.querySelector('[data-app-switcher-strip]');
const quickLook = document.querySelector('[data-quick-look]');
const quickLookTitle = quickLook?.querySelector('[data-quick-look-title]');
const quickLookSubtitle = quickLook?.querySelector('[data-quick-look-subtitle]');
const quickLookPreview = quickLook?.querySelector('[data-quick-look-preview]');
const quickLookDescription = quickLook?.querySelector('[data-quick-look-description]');
const quickLookOpenButton = quickLook?.querySelector('[data-quick-look-open]');
const quickLookCloseElements = quickLook
  ? Array.from(quickLook.querySelectorAll('[data-quick-look-close]'))
  : [];
const controlTiles = controlCenter ? Array.from(controlCenter.querySelectorAll('[data-toggle]')) : [];

const wallpapers = {
  sunset: `radial-gradient(circle at top, rgba(255, 200, 150, 0.4), transparent 40%),
           radial-gradient(circle at bottom, rgba(64, 156, 255, 0.5), transparent 45%),
           linear-gradient(135deg, #0d1321, #16213e, #432371)`,
  aurora: `radial-gradient(circle at 20% 20%, rgba(150, 255, 210, 0.35), transparent 45%),
           radial-gradient(circle at 80% 80%, rgba(100, 180, 255, 0.5), transparent 50%),
           linear-gradient(135deg, #011627, #242038, #752a7c)`,
  abstract: `radial-gradient(circle at 30% 10%, rgba(255, 102, 196, 0.4), transparent 45%),
             radial-gradient(circle at 70% 90%, rgba(255, 202, 102, 0.4), transparent 40%),
             linear-gradient(135deg, #0b0d21, #302b63, #24243e)`,
  solar: `radial-gradient(circle at 35% 15%, rgba(255, 243, 178, 0.45), transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 140, 104, 0.4), transparent 55%),
          linear-gradient(135deg, #1f0c37, #53174e, #f05a7e)`,
};

const appCatalog = [
  { id: 'finder', name: 'Finder', description: 'Przeglądaj pliki i foldery na wirtualnym dysku.' },
  { id: 'notes', name: 'Notatki', description: 'Zapisuj pomysły, szkice i szybkie checklisty.' },
  { id: 'safari', name: 'Safari', description: 'Prawdziwa mini-przeglądarka z paskiem adresu i historią.' },
  { id: 'terminal', name: 'Terminal', description: 'Konsola z poleceniami do automatyzacji symulatora.' },
  { id: 'music', name: 'Muzyka', description: 'Generatywny odtwarzacz ambientu sterowany z Centrum.' },
  { id: 'calendar', name: 'Kalendarz', description: 'Planer miesiąca z nadchodzącymi wydarzeniami.' },
  { id: 'settings', name: 'Preferencje systemowe', description: 'Personalizuj tapety i wygląd systemu.' },
];

let activeWindows = [];
let zIndexCounter = 10;
let currentWallpaper = 'sunset';

const appIconMap = {
  finder: 'finder-icon',
  notes: 'notes-icon',
  safari: 'safari-icon',
  terminal: 'terminal-icon',
  music: 'music-icon',
  calendar: 'calendar-icon',
  settings: 'settings-icon',
};

const SAFARI_PROXY_PREFIX = 'https://r.jina.ai/';
const safariState = {
  history: [],
  index: -1,
  initialized: false,
  isLoading: false,
  navigate: null,
};

const terminalState = {
  initialized: false,
  history: [],
  pointer: -1,
  log: null,
  input: null,
  initialMarkup: '',
};

const musicState = {
  initialized: false,
  playlist: [
    {
      title: 'Oceanic Breeze',
      artist: 'Modular Dreams',
      duration: 218,
      emoji: '🌊',
      color: ['#0ea5e9', '#38bdf8'],
      pattern: [
        { freq: 220, sweep: 246, length: 0.24, type: 'sine' },
        { freq: 184, sweep: 196, length: 0.18, type: 'triangle' },
        { freq: 294, sweep: 330, length: 0.32, type: 'sine' },
        { freq: 247, sweep: 220, length: 0.26, type: 'sawtooth' },
      ],
    },
    {
      title: 'Glass Morphic',
      artist: 'UI Ensemble',
      duration: 198,
      emoji: '🪟',
      color: ['#6366f1', '#a855f7'],
      pattern: [
        { freq: 330, sweep: 349, length: 0.28, type: 'triangle' },
        { freq: 262, sweep: 277, length: 0.22, type: 'sine' },
        { freq: 392, sweep: 415, length: 0.3, type: 'sawtooth' },
        { freq: 311, sweep: 294, length: 0.2, type: 'triangle' },
      ],
    },
    {
      title: 'Northern Lights',
      artist: 'Arctic Pads',
      duration: 242,
      emoji: '🌌',
      color: ['#22d3ee', '#0f766e'],
      pattern: [
        { freq: 261, sweep: 277, length: 0.25, type: 'sine' },
        { freq: 207, sweep: 220, length: 0.25, type: 'triangle' },
        { freq: 329, sweep: 349, length: 0.3, type: 'sine' },
        { freq: 174, sweep: 196, length: 0.2, type: 'triangle' },
      ],
    },
  ],
  index: 0,
  isPlaying: false,
  loop: false,
  shuffle: false,
  audioContext: null,
  gainNode: null,
  oscillators: [],
  startedAt: 0,
  pausedAt: 0,
  progressInterval: null,
  elements: {},
  volume: 0.8,
};

const calendarState = {
  initialized: false,
  currentDate: new Date(),
  events: [],
};

const notificationState = {
  initialized: false,
  items: [],
  suppressed: [],
};

const controlState = {
  wifi: true,
  bluetooth: true,
  focus: false,
};

const spotlightState = {
  initialized: false,
  results: [],
  activeIndex: 0,
};

const quickLookState = {
  open: false,
  item: null,
};

const finderState = {
  selectedItem: null,
};

const appSwitcherState = {
  visible: false,
  items: [],
  index: 0,
};

const relativeFormatter = new Intl.RelativeTimeFormat('pl-PL', { numeric: 'auto' });
const dateFormatter = new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric' });

function updateClock() {
  const now = new Date();
  const options = { hour: '2-digit', minute: '2-digit' };
  if (clockElement) {
    clockElement.textContent = now.toLocaleTimeString('pl-PL', options);
  }
}

setInterval(updateClock, 30000);
updateClock();

document.querySelectorAll('[data-app-window]').forEach((windowEl, index) => {
  windowEl.style.left = `${32 + index * 32}px`;
  windowEl.style.top = `${100 + index * 36}px`;
});

function bringToFront(windowEl) {
  zIndexCounter += 1;
  windowEl.style.zIndex = zIndexCounter;
  activeWindows = activeWindows.filter((win) => win !== windowEl);
  activeWindows.push(windowEl);
}

function updateDockIndicator(appId, isOpen) {
  const dockItem = dock?.querySelector(`[data-app="${appId}"]`);
  if (dockItem) {
    dockItem.dataset.open = isOpen ? 'true' : 'false';
  }
}

function applyWallpaper(key) {
  if (!wallpapers[key]) {
    return false;
  }
  wallpaperElement.style.background = wallpapers[key];
  currentWallpaper = key;
  document
    .querySelectorAll('[data-wallpaper]')
    .forEach((button) => button.classList.toggle('active', button.dataset.wallpaper === key));
  return true;
}

function getAppMetadata(appId) {
  return appCatalog.find((app) => app.id === appId) ?? { id: appId, name: appId, description: '' };
}

function getAppIconClass(appId) {
  return appIconMap[appId] ?? 'finder-icon';
}

function refreshAppSwitcherItems() {
  if (!appSwitcherStrip) return [];
  const unique = [];
  const seen = new Set();

  activeWindows.forEach((win) => {
    if (win.getAttribute('data-active') !== 'true') return;
    const appId = win.dataset.appWindow;
    if (!appId || seen.has(appId)) return;
    seen.add(appId);
    const meta = getAppMetadata(appId);
    unique.push({ id: appId, name: meta.name, description: meta.description });
  });

  appSwitcherStrip.innerHTML = '';

  unique.forEach((item) => {
    const option = document.createElement('div');
    option.className = 'app-switcher-item';
    option.setAttribute('role', 'option');
    option.dataset.app = item.id;

    const icon = document.createElement('div');
    icon.className = `app-switcher-icon ${getAppIconClass(item.id)}`;
    option.append(icon);

    const label = document.createElement('span');
    label.textContent = item.name;
    option.append(label);

    if (item.description) {
      const hint = document.createElement('small');
      hint.textContent = item.description;
      option.append(hint);
    }

    appSwitcherStrip.append(option);
  });

  appSwitcherState.items = unique;
  return unique;
}

function updateAppSwitcherActive() {
  if (!appSwitcherStrip) return;
  const nodes = Array.from(appSwitcherStrip.querySelectorAll('.app-switcher-item'));
  nodes.forEach((node, index) => {
    if (index === appSwitcherState.index) {
      node.dataset.active = 'true';
      node.setAttribute('aria-selected', 'true');
    } else {
      node.removeAttribute('data-active');
      node.removeAttribute('aria-selected');
    }
  });
}

function hideAppSwitcher() {
  if (!appSwitcher) return;
  appSwitcher.hidden = true;
  appSwitcherState.visible = false;
  appSwitcherState.items = [];
  appSwitcherState.index = 0;
  if (appSwitcherStrip) {
    appSwitcherStrip.innerHTML = '';
  }
}

function cycleAppSwitcher(direction) {
  if (!appSwitcher) return;
  const items = refreshAppSwitcherItems();
  if (items.length === 0) {
    hideAppSwitcher();
    return;
  }

  if (!appSwitcherState.visible) {
    appSwitcher.hidden = false;
    appSwitcherState.visible = true;
    appSwitcherState.index = direction < 0 ? items.length - 1 : 0;
    updateAppSwitcherActive();
    return;
  }

  if (appSwitcherState.index >= items.length) {
    appSwitcherState.index = items.length - 1;
  }
  if (appSwitcherState.index < 0) {
    appSwitcherState.index = 0;
  }

  appSwitcherState.index =
    (appSwitcherState.index + direction + items.length) % items.length;
  updateAppSwitcherActive();
}

function activateAppFromSwitcher() {
  if (!appSwitcherState.visible) return;
  const selected = appSwitcherState.items[appSwitcherState.index];
  hideAppSwitcher();
  if (selected) {
    openWindow(selected.id);
  }
}

function isFinderFrontmost() {
  const front = activeWindows.at(-1);
  return front?.dataset.appWindow === 'finder' && front.dataset.minimized !== 'true';
}

function setFinderSelection(item) {
  if (!item) return;
  if (finderState.selectedItem === item) return;
  finderState.selectedItem?.classList.remove('selected');
  finderState.selectedItem = item;
  item.classList.add('selected');
}

function renderQuickLookPreview(item) {
  if (!quickLookPreview) return;
  quickLookPreview.innerHTML = '';
  const kind = (item.dataset.previewKind || '').toLowerCase();
  if (kind) {
    quickLookPreview.dataset.kind = kind;
  } else {
    quickLookPreview.removeAttribute('data-kind');
  }

  if (item.dataset.previewImage) {
    const img = document.createElement('img');
    img.src = item.dataset.previewImage;
    img.alt = item.dataset.previewTitle || 'Podgląd';
    quickLookPreview.append(img);
    return;
  }

  const variant = item.dataset.previewIcon || (kind === 'folder' ? 'folder' : 'document');
  const icon = document.createElement('div');
  icon.className = `quick-look-icon ${variant}`;
  if (variant === 'pdf') {
    icon.textContent = 'PDF';
  } else if (variant === 'folder') {
    icon.textContent = '📁';
  } else {
    icon.textContent = '📄';
  }
  quickLookPreview.append(icon);
}

function openQuickLookFrom(item) {
  if (!quickLook) return;
  setFinderSelection(item);

  const title = item.dataset.previewTitle || item.querySelector('span')?.textContent || 'Podgląd';
  const subtitle = item.dataset.previewKind || '';
  const description = item.dataset.previewBody || 'Brak dodatkowych informacji.';

  if (quickLookTitle) {
    quickLookTitle.textContent = title;
  }
  if (quickLookSubtitle) {
    quickLookSubtitle.textContent = subtitle;
    quickLookSubtitle.hidden = !subtitle;
  }
  if (quickLookDescription) {
    quickLookDescription.textContent = description;
    quickLookDescription.hidden = !description;
  }

  renderQuickLookPreview(item);

  if (quickLookOpenButton) {
    const target = item.dataset.previewOpen;
    if (target) {
      quickLookOpenButton.hidden = false;
      quickLookOpenButton.dataset.target = target;
    } else {
      quickLookOpenButton.hidden = true;
      delete quickLookOpenButton.dataset.target;
    }
  }

  quickLook.hidden = false;
  quickLook.setAttribute('aria-hidden', 'false');
  quickLookState.open = true;
  quickLookState.item = item;
}

function closeQuickLook() {
  if (!quickLookState.open || !quickLook) return;
  quickLook.hidden = true;
  quickLook.setAttribute('aria-hidden', 'true');
  quickLookState.open = false;
  quickLookState.item = null;
  if (quickLookPreview) {
    quickLookPreview.innerHTML = '';
    quickLookPreview.removeAttribute('data-kind');
  }
}

function setupFinderInteractions() {
  const finderWindow = document.querySelector('[data-app-window="finder"]');
  if (!finderWindow) return;
  const items = finderWindow.querySelectorAll('.content-grid .grid-item');
  items.forEach((item) => {
    item.addEventListener('click', () => setFinderSelection(item));
    item.addEventListener('focus', () => setFinderSelection(item));
    item.addEventListener('dblclick', (event) => {
      event.preventDefault();
      openQuickLookFrom(item);
    });
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        openQuickLookFrom(item);
      }
    });
  });
}

function openWindow(appId) {
  let windowEl = document.querySelector(`[data-app-window="${appId}"]`);

  if (!windowEl && appId === 'settings') {
    windowEl = createSettingsWindow();
  }

  if (!windowEl) {
    return;
  }

  if (appId === 'safari') {
    setupSafari();
    if (safariState.history.length === 0 && typeof safariState.navigate === 'function') {
      safariState
        .navigate('https://www.apple.com/pl', { preset: null })
        .catch(() => {
          /* błędy widoczne w oknie Safari */
        });
    }
  }

  if (appId === 'terminal') {
    setupTerminal();
    terminalState.input?.focus();
  }

  if (appId === 'music') {
    setupMusic();
  }

  if (appId === 'calendar') {
    setupCalendar();
  }

  windowEl.setAttribute('data-active', 'true');
  windowEl.removeAttribute('aria-hidden');
  windowEl.dataset.minimized = 'false';
  bringToFront(windowEl);
  updateDockIndicator(appId, true);
  if (!activeWindows.includes(windowEl)) {
    activeWindows.push(windowEl);
  }
}

function closeWindow(windowEl) {
  windowEl.removeAttribute('data-active');
  windowEl.setAttribute('aria-hidden', 'true');
  windowEl.dataset.minimized = 'false';
  const appId = windowEl.dataset.appWindow;
  activeWindows = activeWindows.filter((win) => win !== windowEl);
  updateDockIndicator(appId, false);
  if (appId === 'finder') {
    finderState.selectedItem?.classList.remove('selected');
    finderState.selectedItem = null;
    if (quickLookState.open) {
      closeQuickLook();
    }
  }
}

function minimizeWindow(windowEl) {
  windowEl.dataset.minimized = 'true';
  updateDockIndicator(windowEl.dataset.appWindow, true);
}

function toggleFullscreen(windowEl) {
  if (windowEl.classList.contains('fullscreen')) {
    windowEl.classList.remove('fullscreen');
    if (windowEl.dataset.prevLeft) windowEl.style.left = windowEl.dataset.prevLeft;
    if (windowEl.dataset.prevTop) windowEl.style.top = windowEl.dataset.prevTop;
    if (windowEl.dataset.prevWidth) windowEl.style.width = windowEl.dataset.prevWidth;
    if (windowEl.dataset.prevHeight) windowEl.style.height = windowEl.dataset.prevHeight;
    delete windowEl.dataset.prevLeft;
    delete windowEl.dataset.prevTop;
    delete windowEl.dataset.prevWidth;
    delete windowEl.dataset.prevHeight;
  } else {
    windowEl.dataset.prevLeft = windowEl.style.left;
    windowEl.dataset.prevTop = windowEl.style.top;
    windowEl.dataset.prevWidth = windowEl.style.width;
    windowEl.dataset.prevHeight = windowEl.style.height;
    windowEl.style.left = '';
    windowEl.style.top = '';
    windowEl.style.width = '';
    windowEl.style.height = '';
    windowEl.classList.add('fullscreen');
  }
}

dock?.addEventListener('click', (event) => {
  const target = event.target.closest('[data-app]');
  if (!target) return;

  const appId = target.dataset.app;
  if (appId === 'trash') {
    target.classList.add('shake');
    setTimeout(() => target.classList.remove('shake'), 600);
    return;
  }

  const windowEl = document.querySelector(`[data-app-window="${appId}"]`);
  if (windowEl && windowEl.getAttribute('data-active') === 'true' && windowEl.dataset.minimized !== 'true') {
    minimizeWindow(windowEl);
  } else {
    openWindow(appId);
  }
});

function createSettingsWindow() {
  const node = settingsTemplate.content.firstElementChild.cloneNode(true);
  desktop?.appendChild(node);
  enableWindowInteractions(node);
  setupSettingsPanel(node);
  applyWallpaper(currentWallpaper);
  return node;
}

function setupSettingsPanel(windowEl) {
  const wallpaperButtons = windowEl.querySelectorAll('[data-wallpaper]');
  wallpaperButtons.forEach((button) => {
    button.addEventListener('click', () => {
      wallpaperButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      applyWallpaper(button.dataset.wallpaper);
    });
  });
}

document.querySelectorAll('.desktop-icon').forEach((icon) => {
  icon.setAttribute('tabindex', '0');
  icon.addEventListener('dblclick', () => {
    openWindow(icon.dataset.app);
  });
  icon.addEventListener('click', (event) => {
    if (event.detail === 2) return;
    openWindow(icon.dataset.app);
  });
  icon.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openWindow(icon.dataset.app);
    }
  });
});

function enableWindowInteractions(windowEl) {
  const titleBar = windowEl.querySelector('.title-bar');
  const closeBtn = windowEl.querySelector('.window-btn.close');
  const minimizeBtn = windowEl.querySelector('.window-btn.minimize');
  const fullscreenBtn = windowEl.querySelector('.window-btn.fullscreen');
  const resizeHandle = windowEl.querySelector('.resize-handle');

  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  let isResizing = false;
  let resizeStartX = 0;
  let resizeStartY = 0;
  let startWidth = 0;
  let startHeight = 0;

  titleBar?.addEventListener('mousedown', (event) => {
    if (windowEl.classList.contains('fullscreen')) return;
    isDragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    initialLeft = parseInt(windowEl.style.left || '0', 10);
    initialTop = parseInt(windowEl.style.top || '0', 10);
    bringToFront(windowEl);
    windowEl.dataset.dragging = 'true';
  });

  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const deltaX = event.clientX - dragStartX;
      const deltaY = event.clientY - dragStartY;
      windowEl.style.left = `${initialLeft + deltaX}px`;
      windowEl.style.top = `${Math.max(initialTop + deltaY, 60)}px`;
    }
    if (isResizing) {
      const deltaX = event.clientX - resizeStartX;
      const deltaY = event.clientY - resizeStartY;
      const newWidth = Math.max(420, startWidth + deltaX);
      const newHeight = Math.max(320, startHeight + deltaY);
      windowEl.style.width = `${newWidth}px`;
      windowEl.style.height = `${newHeight}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      windowEl.dataset.dragging = 'false';
    }
    if (isResizing) {
      isResizing = false;
      windowEl.dataset.resizing = 'false';
    }
  });

  resizeHandle?.addEventListener('mousedown', (event) => {
    event.preventDefault();
    if (windowEl.classList.contains('fullscreen')) return;
    isResizing = true;
    resizeStartX = event.clientX;
    resizeStartY = event.clientY;
    startWidth = windowEl.offsetWidth;
    startHeight = windowEl.offsetHeight;
    bringToFront(windowEl);
    windowEl.dataset.resizing = 'true';
  });

  windowEl.addEventListener('mousedown', () => {
    bringToFront(windowEl);
  });

  closeBtn?.addEventListener('click', () => closeWindow(windowEl));
  minimizeBtn?.addEventListener('click', () => minimizeWindow(windowEl));
  fullscreenBtn?.addEventListener('click', () => toggleFullscreen(windowEl));
}

document.querySelectorAll('[data-app-window]').forEach(enableWindowInteractions);
setupFinderInteractions();

quickLookCloseElements.forEach((element) => {
  element.addEventListener('click', () => closeQuickLook());
});

quickLookOpenButton?.addEventListener('click', () => {
  const target = quickLookOpenButton.dataset.target;
  closeQuickLook();
  if (target) {
    openWindow(target);
  }
});

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Tab') {
    event.preventDefault();
    cycleAppSwitcher(event.shiftKey ? -1 : 1);
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'q') {
    const activeWindow = activeWindows.at(-1);
    if (activeWindow) {
      closeWindow(activeWindow);
    }
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.code === 'Space') {
    event.preventDefault();
    toggleSpotlight(true);
    return;
  }

  if (event.key === 'Escape') {
    if (quickLookState.open) {
      closeQuickLook();
      return;
    }

    if (spotlight && !spotlight.hidden) {
      toggleSpotlight(false);
    } else {
      hideControlCenter();
      hideNotificationCenter();
    }
  }
});

document.addEventListener('keyup', (event) => {
  if (!appSwitcherState.visible) return;
  if (event.key === 'Meta' || event.key === 'Control' || event.key === 'Alt') {
    activateAppFromSwitcher();
  }
});

window.addEventListener('blur', () => {
  if (appSwitcherState.visible) {
    hideAppSwitcher();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.code !== 'Space' || event.repeat) return;
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable) {
    return;
  }
  if (quickLookState.open) {
    event.preventDefault();
    closeQuickLook();
    return;
  }
  if (isFinderFrontmost() && finderState.selectedItem) {
    event.preventDefault();
    openQuickLookFrom(finderState.selectedItem);
  }
});

function setupSafari() {
  if (safariState.initialized) return;
  const safariWindow = document.querySelector('[data-app-window="safari"]');
  if (!safariWindow) return;

  const form = safariWindow.querySelector('[data-safari-form]');
  const input = safariWindow.querySelector('[data-safari-input]');
  const iframe = safariWindow.querySelector('[data-safari-webview]');
  const status = safariWindow.querySelector('[data-safari-status]');
  const backBtn = safariWindow.querySelector('[data-safari-back]');
  const forwardBtn = safariWindow.querySelector('[data-safari-forward]');
  const refreshBtn = safariWindow.querySelector('[data-safari-refresh]');

  function setSafariStatus(message, state = 'idle') {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  }

  function updateSafariButtons() {
    const hasHistory = safariState.history.length > 0;
    if (backBtn) {
      backBtn.disabled = safariState.index <= 0 || safariState.isLoading;
    }
    if (forwardBtn) {
      forwardBtn.disabled = safariState.index >= safariState.history.length - 1 || safariState.index === -1 || safariState.isLoading;
    }
    if (refreshBtn) {
      refreshBtn.disabled = !hasHistory || safariState.index === -1 || safariState.isLoading;
    }
  }

  function normalizeAddress(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) return null;

    const httpProtocol = /^(https?:)\/\//i;
    const otherProtocol = /^[a-z][a-z0-9+.-]*:\/\//i;

    if (httpProtocol.test(trimmed)) {
      try {
        const url = new URL(trimmed);
        return { url: url.toString(), display: url.toString(), raw: trimmed };
      } catch (error) {
        return null;
      }
    }

    if (otherProtocol.test(trimmed)) {
      try {
        const url = new URL(trimmed);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          return { url: url.toString(), display: url.toString(), raw: trimmed };
        }
        return null;
      } catch (error) {
        return null;
      }
    }

    if (trimmed.includes(' ')) {
      const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
      return { url: searchUrl, display: trimmed, raw: trimmed };
    }

    if (/^[\w.-]+\.[a-z]{2,}$/i.test(trimmed)) {
      const url = `https://${trimmed}`;
      return { url, display: url, raw: trimmed };
    }

    const fallback = `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
    return { url: fallback, display: trimmed, raw: trimmed };
  }

  function sanitizeSafariHtml(html, baseUrl) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    doc.querySelectorAll('script, iframe, object, embed').forEach((node) => node.remove());
    doc.querySelectorAll('*').forEach((element) => {
      [...element.attributes].forEach((attr) => {
        if (attr.name.startsWith('on')) {
          element.removeAttribute(attr.name);
        }
      });
    });

    const head = doc.head || doc.createElement('head');
    if (!doc.head) {
      doc.documentElement.prepend(head);
    }

    const base = doc.createElement('base');
    base.href = baseUrl;
    head.prepend(base);

    const resetStyle = doc.createElement('style');
    resetStyle.textContent = `body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0 auto; padding: 24px; max-width: min(1200px, 100%); line-height: 1.6; color: #111827; background: #ffffff; } a { color: #0a84ff; } img, video { max-width: 100%; height: auto; }`;
    head.appendChild(resetStyle);

    if (!doc.body) {
      const body = doc.createElement('body');
      doc.documentElement.appendChild(body);
    }

    return `<!DOCTYPE html>${doc.documentElement.outerHTML}`;
  }

  async function navigate(rawInput, { addToHistory = true, preset = null } = {}) {
    if (safariState.isLoading) return;

    const normalized = preset ?? normalizeAddress(rawInput);
    if (!normalized) {
      setSafariStatus('Nie udało się rozpoznać adresu. Spróbuj ponownie.', 'error');
      return;
    }

    const { url, display, raw } = normalized;
    const proxiedUrl = `${SAFARI_PROXY_PREFIX}${url}`;
    safariState.isLoading = true;
    updateSafariButtons();
    if (input) input.value = display;
    setSafariStatus(`Ładowanie: ${url}`, 'loading');
    if (iframe) {
      iframe.srcdoc = `<!DOCTYPE html><html lang=\"pl\"><head><meta charset=\"utf-8\"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f3f4f6;color:#1f2937;} .spinner{width:48px;height:48px;border:4px solid rgba(15,23,42,0.15);border-top-color:#0a84ff;border-radius:50%;animation:spin 0.8s linear infinite;}@keyframes spin{to{transform:rotate(360deg);}}</style></head><body><div class=\"spinner\" role=\"progressbar\" aria-label=\"Ładowanie\"></div></body></html>`;
    }

    try {
      const response = await fetch(proxiedUrl, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`Kod odpowiedzi: ${response.status}`);
      }
      const html = await response.text();
      const sanitized = sanitizeSafariHtml(html, url);
      if (iframe) iframe.srcdoc = sanitized;
      setSafariStatus(`Wyświetlam: ${url}`, 'ready');

      if (addToHistory) {
        safariState.history.splice(safariState.index + 1);
        safariState.history.push({ raw: raw ?? rawInput, url, display });
        safariState.index = safariState.history.length - 1;
      }
    } catch (error) {
      if (iframe) {
        iframe.srcdoc = `<!DOCTYPE html><html lang=\"pl\"><head><meta charset=\"utf-8\"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#fef2f2;color:#991b1b;padding:24px;text-align:center;} .panel{max-width:420px;background:#fee2e2;border-radius:16px;padding:24px;box-shadow:0 12px 30px rgba(153,27,27,0.15);} h1{font-size:20px;margin-bottom:12px;} p{font-size:14px;line-height:1.5;}</style></head><body><div class=\"panel\"><h1>Nie udało się wczytać strony</h1><p>Spróbuj ponownie później lub wpisz inny adres.</p><p>Szczegóły: ${error.message}</p></div></body></html>`;
      }
      setSafariStatus(`Błąd ładowania: ${error.message}`, 'error');
    } finally {
      safariState.isLoading = false;
      updateSafariButtons();
    }
  }

  function goToHistory(index) {
    const entry = safariState.history[index];
    if (!entry) return;
    safariState.index = index;
    navigate(entry.raw, { addToHistory: false, preset: entry });
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!input) return;
    const value = input.value.trim();
    if (!value) {
      setSafariStatus('Wpisz adres strony lub zapytanie.', 'error');
      return;
    }
    navigate(value).catch(() => {
      /* błędy obsłużone wewnątrz navigate */
    });
  });

  backBtn?.addEventListener('click', () => {
    if (safariState.isLoading) return;
    if (safariState.index > 0) {
      goToHistory(safariState.index - 1);
    }
  });

  forwardBtn?.addEventListener('click', () => {
    if (safariState.isLoading) return;
    if (safariState.index < safariState.history.length - 1) {
      goToHistory(safariState.index + 1);
    }
  });

  refreshBtn?.addEventListener('click', () => {
    if (safariState.isLoading) return;
    const entry = safariState.history[safariState.index];
    if (entry) {
      navigate(entry.raw, { addToHistory: false, preset: entry }).catch(() => {
        /* obsługa błędu w navigate */
      });
    }
  });

  safariState.initialized = true;
  safariState.navigate = navigate;
  updateSafariButtons();
  setSafariStatus('Wpisz adres strony lub zapytanie, aby rozpocząć przeglądanie.', 'idle');
}

function appendTerminalLine(message, options = {}) {
  if (!terminalState.log) return;
  const line = document.createElement('div');
  line.className = 'terminal-line';
  if (options.type === 'error') {
    line.style.color = '#f87171';
  }
  if (options.type === 'info') {
    line.style.color = '#60a5fa';
  }
  line.textContent = message;
  terminalState.log.append(line);
  terminalState.log.scrollTop = terminalState.log.scrollHeight;
}

function handleTerminalCommand(inputValue) {
  const raw = inputValue.trim();
  if (!raw) return;
  const [command, ...rest] = raw.split(' ');
  const argument = rest.join(' ');

  switch (command) {
    case 'help': {
      appendTerminalLine('Dostępne polecenia:');
      appendTerminalLine('  help                - wyświetl tę pomoc');
      appendTerminalLine('  ls                  - pokaż katalogi na biurku');
      appendTerminalLine('  open <app>          - uruchom aplikację (finder, safari, notes, music, calendar, settings)');
      appendTerminalLine('  wallpaper list      - wypisz dostępne tapety');
      appendTerminalLine('  wallpaper set <id>  - ustaw tapetę (sunset, aurora, abstract, solar)');
      appendTerminalLine('  focus <on|off>      - steruj trybem skupienia');
      appendTerminalLine('  notify <tekst>      - utwórz własne powiadomienie');
      appendTerminalLine('  music <cmd>         - polecenia: play, pause, next, prev');
      appendTerminalLine('  date / time         - pokaz aktualną datę i godzinę');
      appendTerminalLine('  clear               - wyczyść ekran');
      appendTerminalLine('  history             - pokaż historię poleceń');
      break;
    }
    case 'ls': {
      appendTerminalLine('Desktop  Dokumenty  Projekty  Muzyka  Zdjęcia  System');
      break;
    }
    case 'open': {
      if (!argument) {
        appendTerminalLine('Podaj nazwę aplikacji, np. "open safari".', { type: 'error' });
        break;
      }
      openWindow(argument.toLowerCase());
      appendTerminalLine(`Uruchamiam aplikację: ${argument}`);
      break;
    }
    case 'wallpaper': {
      if (argument === 'list') {
        appendTerminalLine(`Dostępne tapety: ${Object.keys(wallpapers).join(', ')}`);
        break;
      }
      if (argument.startsWith('set ')) {
        const key = argument.replace('set ', '').trim();
        if (applyWallpaper(key)) {
          appendTerminalLine(`Tapeta zmieniona na: ${key}`);
        } else {
          appendTerminalLine('Nie znaleziono takiej tapety.', { type: 'error' });
        }
        break;
      }
      appendTerminalLine('Nieznane polecenie wallpaper. Użyj "wallpaper list" lub "wallpaper set <id>".', { type: 'error' });
      break;
    }
    case 'focus': {
      if (argument === 'on') {
        setFocusMode(true);
        appendTerminalLine('Tryb skupienia został włączony.');
      } else if (argument === 'off') {
        setFocusMode(false);
        appendTerminalLine('Tryb skupienia został wyłączony.');
      } else {
        appendTerminalLine('Użyj: focus on | focus off', { type: 'error' });
      }
      break;
    }
    case 'notify': {
      if (!argument) {
        appendTerminalLine('Podaj treść powiadomienia.', { type: 'error' });
        break;
      }
      pushNotification({ title: 'Terminal', body: argument, app: 'Terminal', critical: true });
      appendTerminalLine('Powiadomienie wysłane.');
      break;
    }
    case 'music': {
      setupMusic();
      if (argument === 'play') {
        startMusicPlayback();
        appendTerminalLine('Odtwarzanie muzyki.');
      } else if (argument === 'pause') {
        pauseMusicPlayback();
        appendTerminalLine('Muzyka wstrzymana.');
      } else if (argument === 'next') {
        nextTrack();
        appendTerminalLine('Następny utwór.');
      } else if (argument === 'prev') {
        previousTrack();
        appendTerminalLine('Poprzedni utwór.');
      } else {
        appendTerminalLine('Polecenia: music play | pause | next | prev', { type: 'error' });
      }
      break;
    }
    case 'date':
    case 'time': {
      const now = new Date();
      appendTerminalLine(`Aktualny czas: ${now.toLocaleString('pl-PL')}`);
      break;
    }
    case 'whoami': {
      appendTerminalLine('Użytkownik: designer (Symulacja macOS)');
      break;
    }
    case 'history': {
      if (terminalState.history.length === 0) {
        appendTerminalLine('Historia poleceń jest pusta.');
      } else {
        terminalState.history.forEach((entry, index) => {
          appendTerminalLine(`${index + 1}. ${entry}`);
        });
      }
      break;
    }
    case 'clear': {
      if (terminalState.log) {
        terminalState.log.innerHTML = terminalState.initialMarkup;
      }
      break;
    }
    default:
      appendTerminalLine(`Polecenie nieznane: ${command}. Wpisz "help" aby zobaczyć listę.`, { type: 'error' });
  }
}

function setupTerminal() {
  if (terminalState.initialized) return;
  const terminalWindow = document.querySelector('[data-app-window="terminal"]');
  if (!terminalWindow) return;

  const log = terminalWindow.querySelector('[data-terminal-log]');
  const form = terminalWindow.querySelector('[data-terminal-form]');
  const input = form?.querySelector('input');
  const login = terminalWindow.querySelector('[data-terminal-login]');

  if (login) {
    login.textContent = new Date().toLocaleString('pl-PL');
  }

  terminalState.log = log;
  terminalState.input = input;
  terminalState.initialMarkup = log?.innerHTML ?? '';

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!input) return;
    const value = input.value.trim();
    if (!value) return;
    appendTerminalLine(`macOS % ${value}`);
    terminalState.history.push(value);
    terminalState.pointer = terminalState.history.length;
    input.value = '';
    handleTerminalCommand(value);
  });

  input?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (terminalState.pointer > 0) {
        terminalState.pointer -= 1;
        input.value = terminalState.history[terminalState.pointer] ?? '';
        setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (terminalState.pointer < terminalState.history.length) {
        terminalState.pointer += 1;
        input.value = terminalState.history[terminalState.pointer] ?? '';
        setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
      } else {
        input.value = '';
      }
    }
  });

  terminalState.initialized = true;
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

function getCurrentTrack() {
  return musicState.playlist[musicState.index];
}

function stopCurrentOscillators() {
  musicState.oscillators.forEach((osc) => {
    try {
      osc.stop();
    } catch (error) {
      /* oscillator już zatrzymany */
    }
  });
  musicState.oscillators = [];
  if (musicState.gainNode) {
    try {
      musicState.gainNode.disconnect();
    } catch (error) {
      /* node już odłączony */
    }
    musicState.gainNode = null;
  }
  if (musicState.progressInterval) {
    clearInterval(musicState.progressInterval);
    musicState.progressInterval = null;
  }
}

function ensureAudioContext() {
  if (!musicState.audioContext) {
    musicState.audioContext = new AudioContext();
  }
  return musicState.audioContext;
}

function scheduleTrackFrom(offset = 0) {
  const track = getCurrentTrack();
  const ctx = ensureAudioContext();
  stopCurrentOscillators();

  const gain = ctx.createGain();
  gain.gain.value = musicState.volume * 0.25;
  gain.connect(ctx.destination);
  musicState.gainNode = gain;

  let timeline = ctx.currentTime;
  let elapsed = 0;

  track.pattern.forEach((segment) => {
    const segmentDuration = track.duration * segment.length;
    const segmentStart = elapsed;
    const segmentEnd = elapsed + segmentDuration;

    if (segmentEnd <= offset) {
      elapsed += segmentDuration;
      return;
    }

    const startOffset = Math.max(0, offset - segmentStart);
    const actualDuration = segmentDuration - startOffset;

    const oscillator = ctx.createOscillator();
    oscillator.type = segment.type ?? 'sine';
    oscillator.frequency.setValueAtTime(segment.freq, timeline);
    if (segment.sweep) {
      oscillator.frequency.linearRampToValueAtTime(segment.sweep, timeline + actualDuration);
    }
    oscillator.connect(gain);
    oscillator.start(timeline);
    oscillator.stop(timeline + actualDuration);
    musicState.oscillators.push(oscillator);

    timeline += actualDuration;
    elapsed += segmentDuration;
  });

  musicState.startedAt = performance.now() - offset * 1000;
  musicState.pausedAt = offset;
  musicState.isPlaying = true;
  updateMusicToggleIcon();
  startProgressTimer();
}

function getProgressSeconds() {
  if (musicState.isPlaying) {
    return Math.min(getCurrentTrack().duration, (performance.now() - musicState.startedAt) / 1000);
  }
  return musicState.pausedAt;
}

function startProgressTimer() {
  if (!musicState.elements.progressBar) return;
  musicState.progressInterval = setInterval(() => {
    const progress = getProgressSeconds();
    const track = getCurrentTrack();
    const ratio = Math.min(1, progress / track.duration);
    musicState.elements.progressBar.style.width = `${ratio * 100}%`;
    musicState.elements.current.textContent = formatDuration(progress);
    if (progress >= track.duration - 0.5) {
      handleTrackEnd();
    }
  }, 250);
}

function updateMusicToggleIcon() {
  if (!musicState.elements.toggle) return;
  musicState.elements.toggle.textContent = musicState.isPlaying ? '⏸' : '▶';
}

function updatePlaylistActiveState() {
  if (!musicState.elements.playlist) return;
  musicState.elements.playlist.querySelectorAll('.playlist-item').forEach((item, index) => {
    item.classList.toggle('active', index === musicState.index);
  });
}

function updateNowPlaying() {
  const track = getCurrentTrack();
  if (!track || !musicState.elements.title) return;
  musicState.elements.title.textContent = track.title;
  musicState.elements.artist.textContent = track.artist;
  musicState.elements.duration.textContent = formatDuration(track.duration);
  musicState.elements.current.textContent = formatDuration(getProgressSeconds());
  musicState.elements.progressBar.style.width = '0%';
  musicState.elements.art.textContent = track.emoji;
  musicState.elements.art.style.background = `linear-gradient(145deg, ${track.color[0]}, ${track.color[1]})`;
  updatePlaylistActiveState();
}

function handleTrackEnd() {
  if (musicState.loop) {
    scheduleTrackFrom(0);
    return;
  }
  if (musicState.shuffle) {
    const nextIndex = Math.floor(Math.random() * musicState.playlist.length);
    musicState.index = nextIndex;
  } else {
    musicState.index = (musicState.index + 1) % musicState.playlist.length;
  }
  musicState.pausedAt = 0;
  updateNowPlaying();
  scheduleTrackFrom(0);
}

function startMusicPlayback() {
  const ctx = ensureAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  scheduleTrackFrom(musicState.pausedAt ?? 0);
}

function pauseMusicPlayback() {
  musicState.pausedAt = getProgressSeconds();
  stopCurrentOscillators();
  musicState.isPlaying = false;
  updateMusicToggleIcon();
}

function toggleMusicPlayback() {
  if (musicState.isPlaying) {
    pauseMusicPlayback();
  } else {
    startMusicPlayback();
  }
}

function nextTrack() {
  musicState.index = (musicState.index + 1) % musicState.playlist.length;
  musicState.pausedAt = 0;
  updateNowPlaying();
  if (musicState.isPlaying) {
    scheduleTrackFrom(0);
  }
}

function previousTrack() {
  musicState.index = (musicState.index - 1 + musicState.playlist.length) % musicState.playlist.length;
  musicState.pausedAt = 0;
  updateNowPlaying();
  if (musicState.isPlaying) {
    scheduleTrackFrom(0);
  }
}

function setupMusic() {
  if (musicState.initialized) return;
  const musicWindow = document.querySelector('[data-app-window="music"]');
  if (!musicWindow) return;

  musicState.elements = {
    title: musicWindow.querySelector('[data-music-title]'),
    artist: musicWindow.querySelector('[data-music-artist]'),
    art: musicWindow.querySelector('[data-music-art]'),
    progressBar: musicWindow.querySelector('[data-music-progress]'),
    current: musicWindow.querySelector('[data-music-current]'),
    duration: musicWindow.querySelector('[data-music-duration]'),
    toggle: musicWindow.querySelector('[data-music-toggle]'),
    prev: musicWindow.querySelector('[data-music-prev]'),
    next: musicWindow.querySelector('[data-music-next]'),
    loop: musicWindow.querySelector('[data-music-loop]'),
    shuffle: musicWindow.querySelector('[data-music-shuffle]'),
    playlist: musicWindow.querySelector('[data-music-playlist]'),
  };

  musicState.volume = volumeSlider ? Number(volumeSlider.value) / 100 : musicState.volume;

  musicState.elements.toggle?.addEventListener('click', () => toggleMusicPlayback());
  musicState.elements.prev?.addEventListener('click', () => previousTrack());
  musicState.elements.next?.addEventListener('click', () => nextTrack());
  musicState.elements.loop?.addEventListener('click', () => {
    musicState.loop = !musicState.loop;
    musicState.elements.loop.classList.toggle('active', musicState.loop);
  });
  musicState.elements.shuffle?.addEventListener('click', () => {
    musicState.shuffle = !musicState.shuffle;
    musicState.elements.shuffle.classList.toggle('active', musicState.shuffle);
  });

  if (musicState.elements.playlist) {
    musicState.playlist.forEach((track, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'playlist-item';
      button.innerHTML = `<div class="meta"><strong>${track.title}</strong><span>${track.artist}</span></div><span class="duration">${formatDuration(track.duration)}</span>`;
      button.addEventListener('click', () => {
        musicState.index = index;
        musicState.pausedAt = 0;
        updateNowPlaying();
        if (musicState.isPlaying) {
          scheduleTrackFrom(0);
        }
      });
      musicState.elements.playlist.append(button);
    });
  }

  updateNowPlaying();
  musicState.initialized = true;
}
function buildEventDate({ monthOffset, day, hour, minute }) {
  const base = new Date();
  const date = new Date(base.getFullYear(), base.getMonth() + monthOffset, day, hour, minute);
  return date;
}

function populateCalendarEvents() {
  const today = new Date();
  calendarState.events = [
    { title: 'Codzienny stand-up', tag: 'Zespół', date: buildEventDate({ monthOffset: 0, day: today.getDate(), hour: 9, minute: 30 }) },
    { title: 'Warsztat produktowy', tag: 'Projekt', date: buildEventDate({ monthOffset: 0, day: today.getDate() + 1, hour: 14, minute: 0 }) },
    { title: 'Spotkanie z klientem', tag: 'Klient', date: buildEventDate({ monthOffset: 0, day: today.getDate() + 2, hour: 11, minute: 30 }) },
    { title: 'Sesja UX Research', tag: 'Badania', date: buildEventDate({ monthOffset: 1, day: 5, hour: 10, minute: 0 }) },
    { title: 'Premiera wersji 1.2', tag: 'Wydanie', date: buildEventDate({ monthOffset: 1, day: 12, hour: 16, minute: 0 }) },
    { title: 'Integracja zespołu', tag: 'People', date: buildEventDate({ monthOffset: 1, day: 18, hour: 18, minute: 30 }) },
  ];
}

function formatRelativeTime(date) {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const diffMinutes = Math.round(diff / 60000);

  if (Math.abs(diffMinutes) < 60) {
    return relativeFormatter.format(diffMinutes, 'minute');
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return relativeFormatter.format(diffHours, 'hour');
  }

  const diffDays = Math.round(diffHours / 24);
  return relativeFormatter.format(diffDays, 'day');
}

function renderCalendar() {
  const calendarWindow = document.querySelector('[data-app-window="calendar"]');
  if (!calendarWindow) return;

  const grid = calendarWindow.querySelector('[data-calendar-grid]');
  const current = calendarWindow.querySelector('[data-calendar-current]');
  const eventsList = calendarWindow.querySelector('[data-calendar-events]');

  const date = calendarState.currentDate;
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  grid.innerHTML = '';
  current.textContent = dateFormatter.format(date);

  for (let i = 1; i < startWeekday; i += 1) {
    const placeholder = document.createElement('div');
    grid.append(placeholder);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    const cellDate = new Date(year, month, day);
    const header = document.createElement('div');
    header.className = 'date';
    header.textContent = day.toString();
    cell.append(header);

    if (cellDate.getTime() === today.getTime()) {
      cell.classList.add('today');
    }

    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'events';

    calendarState.events
      .filter((event) => event.date.getFullYear() === year && event.date.getMonth() === month && event.date.getDate() === day)
      .forEach((event) => {
        const tag = document.createElement('span');
        tag.className = 'calendar-tag';
        tag.textContent = event.tag;
        eventsContainer.append(tag);
      });

    cell.append(eventsContainer);
    grid.append(cell);
  }

  const upcoming = calendarState.events
    .filter((event) => event.date.getTime() >= today.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  eventsList.innerHTML = '';
  upcoming.forEach((event) => {
    const item = document.createElement('li');
    item.className = 'calendar-event';
    const title = document.createElement('strong');
    title.textContent = event.title;
    const time = document.createElement('time');
    time.dateTime = event.date.toISOString();
    time.textContent = `${event.date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} • ${formatRelativeTime(event.date)}`;
    const tag = document.createElement('span');
    tag.className = 'calendar-tag';
    tag.textContent = event.tag;
    item.append(title, time, tag);
    eventsList.append(item);
  });
}

function setupCalendar() {
  if (calendarState.initialized) return;
  const calendarWindow = document.querySelector('[data-app-window="calendar"]');
  if (!calendarWindow) return;

  populateCalendarEvents();
  const prev = calendarWindow.querySelector('[data-calendar-prev]');
  const next = calendarWindow.querySelector('[data-calendar-next]');

  prev?.addEventListener('click', () => {
    calendarState.currentDate = new Date(calendarState.currentDate.getFullYear(), calendarState.currentDate.getMonth() - 1, 1);
    renderCalendar();
  });

  next?.addEventListener('click', () => {
    calendarState.currentDate = new Date(calendarState.currentDate.getFullYear(), calendarState.currentDate.getMonth() + 1, 1);
    renderCalendar();
  });

  renderCalendar();
  calendarState.initialized = true;
}

function showControlCenter() {
  if (!controlCenter) return;
  controlCenter.hidden = false;
}

function hideControlCenter() {
  if (!controlCenter) return;
  controlCenter.hidden = true;
}

function toggleControlCenter() {
  if (!controlCenter) return;
  if (controlCenter.hidden) {
    showControlCenter();
  } else {
    hideControlCenter();
  }
}

function showNotificationCenter() {
  if (!notificationCenter) return;
  notificationCenter.hidden = false;
  notificationToggle?.setAttribute('data-unread', 'false');
}

function hideNotificationCenter() {
  if (!notificationCenter) return;
  notificationCenter.hidden = true;
}

function toggleNotificationCenter() {
  if (!notificationCenter) return;
  if (notificationCenter.hidden) {
    showNotificationCenter();
  } else {
    hideNotificationCenter();
  }
}

function setFocusMode(enabled) {
  controlState.focus = enabled;
  const focusTile = controlCenter?.querySelector('[data-toggle="focus"]');
  const focusStatus = focusTile?.querySelector('[data-status="focus"]');
  focusTile?.classList.toggle('active', enabled);
  if (focusStatus) {
    focusStatus.textContent = enabled ? 'Włączony' : 'Wyłączony';
  }
  document.body.dataset.focus = enabled ? 'true' : 'false';

  if (enabled) {
    pushNotification({ title: 'Tryb skupienia', body: 'Powiadomienia zostały wstrzymane.', app: 'System', critical: true, system: true });
  } else if (notificationState.suppressed.length > 0) {
    const suppressed = notificationState.suppressed.splice(0);
    suppressed.reverse().forEach((item) => {
      notificationState.items.unshift(item);
    });
    updateNotificationList();
    pushNotification({ title: 'Tryb skupienia', body: 'Dostarczono oczekujące powiadomienia.', app: 'System', critical: true, system: true });
  }
}

function updateControlTile(key) {
  const tile = controlCenter?.querySelector(`[data-toggle="${key}"]`);
  const status = tile?.querySelector(`[data-status="${key}"]`);
  if (!tile || !status) return;
  if (key === 'wifi') {
    tile.classList.toggle('active', controlState.wifi);
    status.textContent = controlState.wifi ? 'Połączono' : 'Wyłączone';
  }
  if (key === 'bluetooth') {
    tile.classList.toggle('active', controlState.bluetooth);
    status.textContent = controlState.bluetooth ? 'Włączony' : 'Wyłączony';
  }
  if (key === 'focus') {
    tile.classList.toggle('active', controlState.focus);
    status.textContent = controlState.focus ? 'Włączony' : 'Wyłączony';
  }
}

function setupControlCenter() {
  if (!controlCenter) return;

  controlToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    hideNotificationCenter();
    toggleControlCenter();
  });

  controlClose?.addEventListener('click', () => hideControlCenter());

  controlTiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      const key = tile.dataset.toggle;
      if (key === 'wifi') {
        controlState.wifi = !controlState.wifi;
        updateControlTile('wifi');
        pushNotification({
          title: 'Wi‑Fi',
          body: controlState.wifi ? 'Połączenie przywrócone.' : 'Sieć Wi‑Fi została wyłączona.',
          app: 'System',
          critical: true,
          system: true,
        });
      } else if (key === 'bluetooth') {
        controlState.bluetooth = !controlState.bluetooth;
        updateControlTile('bluetooth');
        pushNotification({
          title: 'Bluetooth',
          body: controlState.bluetooth ? 'Bluetooth włączony.' : 'Bluetooth wyłączony.',
          app: 'System',
          critical: true,
          system: true,
        });
      } else if (key === 'focus') {
        setFocusMode(!controlState.focus);
      }
    });
  });

  if (brightnessSlider) {
    const apply = () => {
      const value = Number(brightnessSlider.value);
      document.documentElement.style.setProperty('--wallpaper-brightness', (value / 100).toFixed(2));
    };
    brightnessSlider.addEventListener('input', apply);
    apply();
  }

  if (volumeSlider) {
    const applyVolume = () => {
      musicState.volume = Number(volumeSlider.value) / 100;
      if (musicState.gainNode && musicState.audioContext) {
        const ctx = ensureAudioContext();
        musicState.gainNode.gain.setTargetAtTime(musicState.volume * 0.25, ctx.currentTime, 0.05);
      }
    };
    volumeSlider.addEventListener('input', applyVolume);
    applyVolume();
  }

  updateControlTile('wifi');
  updateControlTile('bluetooth');
  updateControlTile('focus');
}

function renderNotification(entry) {
  const card = document.createElement('article');
  card.className = 'notification-card';
  if (entry.system) {
    card.classList.add('system');
  }
  const header = document.createElement('div');
  header.className = 'title';
  header.textContent = `${entry.title} · ${entry.app}`;
  const body = document.createElement('p');
  body.textContent = entry.body;
  const time = document.createElement('span');
  time.className = 'time';
  time.textContent = formatRelativeTime(entry.time);
  card.append(header, body, time);
  return card;
}

function updateNotificationList() {
  if (!notificationList) return;
  notificationList.innerHTML = '';

  if (controlState.focus && notificationState.suppressed.length > 0) {
    const info = {
      title: 'Tryb skupienia',
      body: `${notificationState.suppressed.length} powiadomienia czekają na dostarczenie.`,
      app: 'System',
      time: new Date(),
      system: true,
    };
    notificationList.append(renderNotification(info));
  }

  notificationState.items.forEach((entry) => {
    notificationList.append(renderNotification(entry));
  });

  if (notificationState.items.length === 0 && (!controlState.focus || notificationState.suppressed.length === 0)) {
    const empty = document.createElement('p');
    empty.className = 'notification-empty';
    empty.textContent = 'Brak powiadomień. Ciesz się spokojem!';
    notificationList.append(empty);
  }

  const hasUnread = notificationState.items.length > 0;
  if (hasUnread) {
    notificationToggle?.setAttribute('data-unread', 'true');
  } else {
    notificationToggle?.setAttribute('data-unread', 'false');
  }
}

function pushNotification({ title, body, app = 'System', critical = false, system = false }) {
  const entry = {
    id: Date.now(),
    title,
    body,
    app,
    time: new Date(),
    system,
  };

  if (controlState.focus && !critical) {
    notificationState.suppressed.unshift(entry);
    updateNotificationList();
    return;
  }

  notificationState.items.unshift(entry);
  updateNotificationList();
}

function setupNotificationCenter() {
  if (!notificationCenter) return;

  notificationToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    hideControlCenter();
    toggleNotificationCenter();
  });

  notificationClear?.addEventListener('click', () => {
    notificationState.items = [];
    notificationState.suppressed = [];
    updateNotificationList();
  });

  updateNotificationList();
}

function scheduleNotifications() {
  const planned = [
    { delay: 2500, title: 'Mail', body: 'Nowa wiadomość od zespołu designu.', app: 'Mail', critical: false },
    { delay: 6500, title: 'Kalendarz', body: 'Warsztat produktowy startuje za 30 minut.', app: 'Kalendarz', critical: false },
    { delay: 11000, title: 'Pogoda', body: 'Słońce i 22°C w Twojej okolicy.', app: 'Pogoda', critical: false },
  ];

  planned.forEach((entry) => {
    setTimeout(() => pushNotification(entry), entry.delay);
  });
}

function toggleSpotlight(show) {
  if (!spotlight) return;
  if (show) {
    spotlight.hidden = false;
    if (spotlightInput) {
      spotlightInput.value = '';
      updateSpotlightResults('');
      setTimeout(() => spotlightInput.focus(), 0);
    }
  } else {
    spotlight.hidden = true;
  }
}

function highlightSpotlight(index) {
  spotlightState.activeIndex = index;
  if (!spotlightResults) return;
  spotlightResults.querySelectorAll('.spotlight-item').forEach((item, itemIndex) => {
    item.classList.toggle('active', itemIndex === index);
  });
}

function updateSpotlightResults(query) {
  if (!spotlightResults) return;
  const normalized = query.trim().toLowerCase();
  const results = [];

  if (normalized.startsWith('>')) {
    const command = query.slice(1).trim();
    results.push({
      label: `Uruchom w Terminalu: ${command || '(puste polecenie)'}`,
      description: 'Polecenie zostanie wykonane natychmiast w terminalu.',
      action: () => {
        toggleSpotlight(false);
        openWindow('terminal');
        setupTerminal();
        if (command) {
          appendTerminalLine(`macOS % ${command}`);
          handleTerminalCommand(command);
        }
      },
    });
  }

  const filteredApps = appCatalog
    .filter((app) => app.name.toLowerCase().includes(normalized) || app.description.toLowerCase().includes(normalized))
    .slice(0, 6)
    .map((app) => ({
      label: app.name,
      description: app.description,
      action: () => {
        toggleSpotlight(false);
        openWindow(app.id);
      },
    }));

  if (!normalized) {
    results.push(...appCatalog.slice(0, 5).map((app) => ({
      label: app.name,
      description: app.description,
      action: () => {
        toggleSpotlight(false);
        openWindow(app.id);
      },
    })));
  } else {
    results.push(...filteredApps);
  }

  if (normalized) {
    results.push({
      label: `Szukaj w Safari: ${query}`,
      description: 'Otwórz Safari i wyszukaj wpisane hasło.',
      action: () => {
        toggleSpotlight(false);
        openWindow('safari');
        setupSafari();
        if (safariState.navigate) {
          safariState.navigate(query).catch(() => {
            /* błąd obsłużony w Safari */
          });
        }
      },
    });
  }

  spotlightResults.innerHTML = '';

  if (results.length === 0) {
    const item = document.createElement('li');
    item.className = 'spotlight-item';
    item.textContent = 'Brak wyników dla podanego hasła.';
    spotlightResults.append(item);
    spotlightState.results = [];
    spotlightState.activeIndex = -1;
    return;
  }

  results.forEach((result, index) => {
    const item = document.createElement('li');
    item.className = 'spotlight-item';
    item.innerHTML = `<span>${result.label}</span><small>${result.description}</small>`;
    item.setAttribute('role', 'option');
    item.addEventListener('click', () => {
      result.action();
    });
    spotlightResults.append(item);
  });

  spotlightState.results = results;
  highlightSpotlight(0);
}

function activateSpotlightSelection(index) {
  const result = spotlightState.results[index];
  if (!result) return;
  result.action();
}

function setupSpotlight() {
  if (spotlightState.initialized) return;

  spotlightInput?.addEventListener('input', (event) => {
    updateSpotlightResults(event.target.value);
  });

  spotlightResults?.addEventListener('click', (event) => {
    const item = event.target.closest('.spotlight-item');
    if (!item) return;
    const index = Array.from(spotlightResults.children).indexOf(item);
    activateSpotlightSelection(index);
  });

  document.addEventListener('keydown', (event) => {
    if (!spotlight || spotlight.hidden) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = Math.min(spotlightState.results.length - 1, spotlightState.activeIndex + 1);
      highlightSpotlight(nextIndex);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const nextIndex = Math.max(0, spotlightState.activeIndex - 1);
      highlightSpotlight(nextIndex);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      activateSpotlightSelection(spotlightState.activeIndex);
    }
  });

  spotlightState.initialized = true;
}

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  if (controlCenter && !controlCenter.hidden) {
    const clickedToggle = target.closest('[data-control-toggle]');
    if (!controlCenter.contains(target) && !clickedToggle) {
      hideControlCenter();
    }
  }

  if (notificationCenter && !notificationCenter.hidden) {
    const clickedToggle = target.closest('[data-notification-toggle]');
    if (!notificationCenter.contains(target) && !clickedToggle) {
      hideNotificationCenter();
    }
  }
});

applyWallpaper(currentWallpaper);
setupSafari();
setupTerminal();
setupMusic();
setupCalendar();
setupControlCenter();
setupNotificationCenter();
setupSpotlight();
scheduleNotifications();

window.addEventListener('load', () => {
  openWindow('finder');
  setTimeout(() => openWindow('notes'), 400);
  setTimeout(() => {
    pushNotification({
      title: 'Porada dnia',
      body: 'Wciśnij ⌘ + Spacja, aby otworzyć Spotlight.',
      app: 'System',
      critical: true,
      system: true,
    });
  }, 1800);
});
