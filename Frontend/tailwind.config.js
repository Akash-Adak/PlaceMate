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
        // Premium Color Palette
        primary: {
          DEFAULT: '#6366f1',
          50: '#f8f6ff',
          100: '#f0edff',
          200: '#e0dbff',
          300: '#d0c5ff',
          400: '#b5a0ff',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#3f0f88',
        },
        secondary: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        accent: {
          cyan: '#06b6d4',
          blue: '#3b82f6',
          violet: '#8b5cf6',
        },
        // Light mode colors
        light: {
          bg: '#ffffff',
          surface: '#f9fafb',
          card: '#ffffff',
          border: '#e5e7eb',
          text: '#1f2937',
          'text-secondary': '#6b7280',
        },
        // Dark mode colors
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          card: '#334155',
          border: '#475569',
          text: '#f1f5f9',
          'text-secondary': '#cbd5e1',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '3rem',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
