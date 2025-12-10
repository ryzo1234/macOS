import { useEffect, useState } from 'react';

const Settings = () => {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [sounds, setSounds] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('typing-arena-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLanguage(parsed.language ?? 'en');
      setTheme(parsed.theme ?? 'light');
      setSounds(parsed.sounds ?? true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('typing-arena-settings', JSON.stringify({ language, theme, sounds }));
  }, [language, theme, sounds]);

  return (
    <main className="page">
      <h1>Settings</h1>
      <div className="controls">
        <label>Default language
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="pl">Polski</option>
          </select>
        </label>
        <label>Theme
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={sounds} onChange={(e) => setSounds(e.target.checked)} /> Sounds
        </label>
      </div>
      <p>Keyboard layout: standard QWERTY hints included in lessons.</p>
    </main>
  );
};

export default Settings;
