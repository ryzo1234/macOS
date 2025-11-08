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
  icon.addEventListener('dblclick', () => {
    openWindow(icon.dataset.app);
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

window.addEventListener('load', () => {
  openWindow('finder');
  setTimeout(() => openWindow('notes'), 400);
});
