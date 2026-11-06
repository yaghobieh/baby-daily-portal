/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#FFF0F0',
          100: '#FFE0E0',
          400: '#FF9494',
          500: '#FF7A7A',
          600: '#E86262',
        },
        mint: {
          50: '#EFFBF5',
          100: '#DCF7EB',
          400: '#64D3A1',
          500: '#48C78E',
          600: '#34A873',
        },
        lavender: {
          50: '#F5F3FC',
          100: '#EAE6F9',
          400: '#A495EC',
          500: '#8C7AE6',
          600: '#7361CE',
        },
        amber: {
          50: '#FFF9EB',
          100: '#FEF2D2',
          400: '#FFBB33',
          500: '#FFAA00',
          600: '#E09500',
        },
        sky: {
          50: '#EEF6FD',
          100: '#DBEDFB',
          400: '#5BA9F3',
          500: '#3897F0',
          600: '#227CD6',
        },
      },
    },
  },
  plugins: [],
}
