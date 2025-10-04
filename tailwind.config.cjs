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
      }
    }
  },
  plugins: []
};
