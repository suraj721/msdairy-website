/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1A7F4B', light: '#22A060', dark: '#145F38', pale: '#E8F5EE' },
        secondary: { DEFAULT: '#1565C0', light: '#1E88E5', dark: '#0D47A1', pale: '#E3F2FD' },
        accent: { DEFAULT: '#F5A623', light: '#FFBB45', dark: '#D4881A', pale: '#FFF8E7' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
