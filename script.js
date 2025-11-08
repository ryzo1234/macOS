const clockElement = document.getElementById('menuClock');
const desktop = document.getElementById('desktop');
const dock = document.getElementById('dock');
const settingsTemplate = document.getElementById('settings-template');

const wallpapers = {
  sunset: `radial-gradient(circle at top, rgba(255, 200, 150, 0.4), transparent 40%),
           radial-gradient(circle at bottom, rgba(64, 156, 255, 0.5), transparent 45%),
           linear-gradient(135deg, #0d1321, #16213e, #432371)`,
  aurora: `radial-gradient(circle at 20% 20%, rgba(150, 255, 210, 0.35), transparent 45%),
           radial-gradient(circle at 80% 80%, rgba(100, 180, 255, 0.5), transparent 50%),
           linear-gradient(135deg, #011627, #242038, #752a7c)`,
  abstract: `radial-gradient(circle at 30% 10%, rgba(255, 102, 196, 0.4), transparent 45%),
             radial-gradient(circle at 70% 90%, rgba(255, 202, 102, 0.4), transparent 40%),
             linear-gradient(135deg, #0b0d21, #302b63, #24243e)`
};

let activeWindows = [];
let zIndexCounter = 10;
const SAFARI_PROXY_PREFIX = 'https://r.jina.ai/';
const safariState = {
  history: [],
  index: -1,
  initialized: false,
  isLoading: false,
  navigate: null,
};

function updateClock() {
  const now = new Date();
  const options = { hour: '2-digit', minute: '2-digit' };
  clockElement.textContent = now.toLocaleTimeString('pl-PL', options);
}

setInterval(updateClock, 30000);
updateClock();

document.querySelectorAll('[data-app-window]').forEach((windowEl, index) => {
  windowEl.style.left = `${25 + index * 30}px`;
  windowEl.style.top = `${100 + index * 40}px`;
});

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
      safariState.navigate('https://www.apple.com/pl', { preset: null }).catch(() => {
        /* błędy są prezentowane w interfejsie Safari */
      });
    }
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
}

function minimizeWindow(windowEl) {
  windowEl.dataset.minimized = 'true';
  const appId = windowEl.dataset.appWindow;
  updateDockIndicator(appId, true);
}

function toggleFullscreen(windowEl) {
  windowEl.classList.toggle('fullscreen');
}

function bringToFront(windowEl) {
  zIndexCounter += 1;
  windowEl.style.zIndex = zIndexCounter;
}

function updateDockIndicator(appId, isOpen) {
  const dockItem = dock.querySelector(`[data-app="${appId}"]`);
  if (dockItem) {
    dockItem.dataset.open = isOpen ? 'true' : 'false';
  }
}

dock.addEventListener('click', (event) => {
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
  desktop.appendChild(node);
  enableWindowInteractions(node);
  setupSettingsPanel(node);
  return node;
}

function setupSettingsPanel(windowEl) {
  const wallpaperButtons = windowEl.querySelectorAll('[data-wallpaper]');
  wallpaperButtons.forEach((button) => {
    button.addEventListener('click', () => {
      wallpaperButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      const wallpaperKey = button.dataset.wallpaper;
      document.querySelector('.wallpaper').style.background = wallpapers[wallpaperKey];
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

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  titleBar.addEventListener('mousedown', (event) => {
    if (windowEl.classList.contains('fullscreen')) return;
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    initialLeft = parseInt(windowEl.style.left || '0', 10);
    initialTop = parseInt(windowEl.style.top || '0', 10);
    bringToFront(windowEl);
    windowEl.dataset.dragging = 'true';
  });

  document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    windowEl.style.left = `${initialLeft + deltaX}px`;
    windowEl.style.top = `${Math.max(initialTop + deltaY, 60)}px`;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    windowEl.dataset.dragging = 'false';
  });

  windowEl.addEventListener('mousedown', () => {
    bringToFront(windowEl);
  });

  closeBtn?.addEventListener('click', () => closeWindow(windowEl));
  minimizeBtn?.addEventListener('click', () => minimizeWindow(windowEl));
  fullscreenBtn?.addEventListener('click', () => toggleFullscreen(windowEl));
}

document.querySelectorAll('[data-app-window]').forEach(enableWindowInteractions);

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'q') {
    const activeWindow = activeWindows.at(-1);
    if (activeWindow) {
      closeWindow(activeWindow);
    }
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
    input.value = display;
    setSafariStatus(`Ładowanie: ${url}`, 'loading');
    iframe.srcdoc = `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f3f4f6;color:#1f2937;} .spinner{width:48px;height:48px;border:4px solid rgba(15,23,42,0.15);border-top-color:#0a84ff;border-radius:50%;animation:spin 0.8s linear infinite;}@keyframes spin{to{transform:rotate(360deg);}}</style></head><body><div class="spinner" role="progressbar" aria-label="Ładowanie"></div></body></html>`;

    try {
      const response = await fetch(proxiedUrl, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`Kod odpowiedzi: ${response.status}`);
      }
      const html = await response.text();
      const sanitized = sanitizeSafariHtml(html, url);
      iframe.srcdoc = sanitized;
      setSafariStatus(`Wyświetlam: ${url}`, 'ready');

      if (addToHistory) {
        safariState.history.splice(safariState.index + 1);
        safariState.history.push({ raw: raw ?? rawInput, url, display });
        safariState.index = safariState.history.length - 1;
      }
    } catch (error) {
      iframe.srcdoc = `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#fef2f2;color:#991b1b;padding:24px;text-align:center;} .panel{max-width:420px;background:#fee2e2;border-radius:16px;padding:24px;box-shadow:0 12px 30px rgba(153,27,27,0.15);} h1{font-size:20px;margin-bottom:12px;} p{font-size:14px;line-height:1.5;}</style></head><body><div class="panel"><h1>Nie udało się wczytać strony</h1><p>Spróbuj ponownie później lub wpisz inny adres.</p><p>Szczegóły: ${error.message}</p></div></body></html>`;
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
      /* błąd obsłużony w navigate */
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

setupSafari();

window.addEventListener('load', () => {
  openWindow('finder');
  setTimeout(() => openWindow('notes'), 400);
});
