 codex/implement-usetheme-hook-and-context
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

 codex/create-dashboardlayout-components-and-routing
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0e0b1f',
        aurora: {
          start: '#00eaff',
          end: '#8a2be2'
        }
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, #00eaff 0%, #8a2be2 100%)'
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        ring: 'var(--color-ring)'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)']
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)'
      },
      boxShadow: {
        card: 'var(--shadow-card)'
 dev
 dev
      }
    }
  },
  plugins: []
};
