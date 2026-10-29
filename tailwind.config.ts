import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#14283F",
          950: "#0D1B2A",
          900: "#14283F", // Primary Deep Navy
          850: "#1B3350",
          800: "#223E61",
          700: "#2D507B",
          600: "#3B669B",
          500: "#4D7CB8",
          100: "#E8EEF5",
          50: "#F2F5F9",
        },
        gold: {
          DEFAULT: "#C49A52",
          700: "#916E30",
          600: "#AC8441",
          500: "#C49A52", // Primary Warm Gold Accent
          400: "#D6B06C",
          300: "#E5C78D",
          200: "#F1DFB7",
          100: "#F7F2E8",
          50: "#FBF9F4",
        },
        charcoal: {
          DEFAULT: "#242424",
          900: "#242424", // Dark charcoal primary text
          800: "#363636",
          700: "#4A4A4A",
          600: "#5E5E5E",
        },
        muted: {
          DEFAULT: "#707780",
          600: "#5D636B",
          500: "#707780", // Muted gray secondary text
          400: "#8B929B",
          300: "#B0B6BE",
          200: "#D3D7DC",
          100: "#EAECEF",
        },
        surface: "#FFFFFF",
        warmBg: "#F6F5F2",
        subtleBorder: "#E5E5E0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
};
export default config;
