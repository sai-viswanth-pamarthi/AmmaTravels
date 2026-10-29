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
        teal: {
          950: '#061D23',
          900: '#0A3641', // Deep Teal primary
          850: '#0D4553',
          800: '#0D5C75', // Brand Teal
          700: '#147493',
          600: '#1B91B7',
          500: '#28A9D4',
          100: '#E1F2F8',
          50: '#F0F8FA',
        },
        saffron: {
          DEFAULT: '#E58B24',
          700: '#B86812',
          600: '#D07A19',
          500: '#E58B24', // Saffron / Amber accent
          400: '#F59E0B',
          300: '#FBBF24',
          200: '#FDE68A',
          100: '#FEF3C7',
          50: '#FFFBEB',
        },
        charcoal: {
          950: '#13161A',
          900: '#1E2229', // Dark charcoal text
          800: '#2A303A',
          700: '#3D4552',
          600: '#555F70',
          500: '#717D91',
        },
        warm: {
          50: '#FBF9F5', // Warm off-white background
          100: '#F7F5F0',
          200: '#ECE9E0',
          300: '#DFDAD0',
        },
        borderLight: '#E5E5DF',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
