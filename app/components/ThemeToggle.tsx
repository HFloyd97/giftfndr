'use client';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  return (
    <button
      onClick={cycleTheme}
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
