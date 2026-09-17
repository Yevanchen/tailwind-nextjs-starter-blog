const colors = require('tailwindcss/colors')
module.exports = {
  content: ['./components/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: { extend: { colors: { primary: colors.emerald }, lineHeight: { 14: '3.5rem' } } },
  plugins: [require('@tailwindcss/typography')],
}
