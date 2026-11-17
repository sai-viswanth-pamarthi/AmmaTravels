/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      colors: {
        racing: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626', // Signature Automotive Racing Red
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        obsidian: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
          999: '#000000', // Pitch Jet Black
        },
        cream: {
          50: '#FFFFFF',  // Clean Pure White
          100: '#FAFAFA', // Soft Off-White
          200: '#F4F4F5',
          300: '#E4E4E7',
          400: '#D4D4D8',
        },
        ink: {
          950: '#050505', // Deep Obsidian Black
          900: '#0F0F0F',
          800: '#18181B',
          700: '#27272A',
          600: '#52525B',
          500: '#71717A',
        },
        teal: {
          950: '#09090B',
          900: '#121212',
          850: '#18181B',
          800: '#27272A',
          700: '#3F3F46',
          600: '#52525B',
          500: '#71717A',
          100: '#F4F4F5',
          50: '#FAFAFA',
        },
        saffron: {
          DEFAULT: '#DC2626',
          700: '#991B1B',
          600: '#B91C1C',
          500: '#DC2626', // Racing Red
          400: '#EF4444',
          300: '#F87171',
          200: '#FECACA',
          100: '#FEE2E2',
          50: '#FEF2F2',
        },
        charcoal: {
          950: '#09090B',
          900: '#121212',
          800: '#18181B',
          700: '#27272A',
          600: '#3F3F46',
          500: '#52525B',
        },
        warm: {
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#F4F4F5',
          300: '#E4E4E7',
        },
        themeBg: 'var(--background)',
        themeText: 'var(--text)',
        themePrimary: 'var(--primary)',
        themeAccent: 'var(--accent)',
        themeCard: 'var(--card)',
        themeBorder: 'var(--border)',
        borderLight: '#E5E7EB',
      },
      fontFamily: {
        display: ['Poppins', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
}
