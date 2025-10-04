import { useMemo } from 'react';
import { useTheme } from '../theme';

const SunIcon = () => (
  <svg
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.364-6.364-1.06 1.06M7.697 16.303l-1.06 1.06m0-12.728 1.06 1.06m9.607 9.607 1.06 1.06M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12.79A9 9 0 1 1 11.21 3 7.5 7.5 0 0 0 21 12.79Z"
    />
  </svg>
);

export const ThemeToggle = () => {
  const { theme, toggle, ready } = useTheme();

  const { label, icon } = useMemo(() => {
    if (theme === 'dark') {
      return { label: 'Modo escuro', icon: <MoonIcon /> };
    }
    return { label: 'Modo claro', icon: <SunIcon /> };
  }, [theme]);

  const nextTheme = theme === 'dark' ? 'claro' : 'escuro';

  return (
    <button
      type="button"
      onClick={toggle}
      className="group relative flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text shadow-card transition-colors hover:border-accent hover:text-accent"
      aria-live="polite"
      aria-label={ready ? `Alternar para modo ${nextTheme}` : 'Alternar tema'}
    >
      <span className="text-accent transition-transform duration-200 group-hover:scale-105">{icon}</span>
      <span className="hidden text-xs font-semibold uppercase tracking-wide text-text md:inline">
        {label}
      </span>
    </button>
  );
};
