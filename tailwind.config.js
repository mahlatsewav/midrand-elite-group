const colors = require("tailwindcss/colors")

module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        slate: colors.slate,
        sky: colors.sky,
        neutral: colors.neutral,
        stone: colors.stone,
        // brand colors
        'brand-dark': '#121212',
        'brand-blue': '#007AFF',
        'brand-light-blue': '#3B82F6',
        'brand-surface': '#1E1E1E',
        'brand-green': '#34C759',
        'brand-yellow': '#FFCC00',
        'brand-text': '#FFFFFF',
        'brand-text-secondary': '#8E8E93',
      },
    },
  },
  plugins: [],
}
