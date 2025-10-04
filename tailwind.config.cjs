const sharedColors = {
  background: 'var(--bg)',
  surface: 'var(--surface)',
  'surface-hover': 'var(--surface-hover)',
  border: 'var(--border)',
  muted: 'var(--muted)',
  text: 'var(--text)',
  'text-muted': 'var(--text-muted)',
  accent: 'var(--accent)',
  'accent-strong': 'var(--accent-strong)',
  'accent-soft': 'var(--accent-soft)',
  track: 'var(--track)',
  positive: 'var(--positive)',
  'positive-soft': 'var(--positive-soft)',
  negative: 'var(--negative)',
  'negative-soft': 'var(--negative-soft)',
  info: 'var(--info)',
  warning: 'var(--warning)'
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: sharedColors,
      backgroundColor: sharedColors,
      textColor: sharedColors,
      borderColor: sharedColors,
      ringColor: sharedColors,
      boxShadow: {
        card: '0 8px 24px -12px var(--shadow)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
