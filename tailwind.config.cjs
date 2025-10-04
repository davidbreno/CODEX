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
      }
    }
  },
  plugins: []
};
