/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter"', 'sans-serif']
      },
      colors: {
        'brand-primary': '#1f6feb',
        'brand-secondary': '#0ea5e9',
        'brand-muted': '#cbd5f5'
      },
      boxShadow: {
        card: '0 10px 30px -15px rgba(15, 23, 42, 0.35)'
      }
    }
  },
  plugins: []
};
