'use client';
import { useTheme } from '../contexts/ThemeContext';
import { trackEvent } from '../utils/analytics';

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  const handleThemeChange = () => {
    cycleTheme();
    // Track theme change
    const nextTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'blue' : 'dark';
    trackEvent.themeChange(nextTheme);
  };

  return (
    <button
      onClick={handleThemeChange}
      className="theme-toggle"
      data-theme={theme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : theme === 'light' ? 'blue' : 'dark'} theme`}
      title={`Current: ${theme} theme. Click to cycle themes.`}
    >
      <span className="theme-icon dark">🌙</span>
      <span className="theme-icon light">☀️</span>
      <span className="theme-icon blue">💙</span>
    </button>
  );
}
