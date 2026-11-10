/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        showroom: {
          bg: '#090A0F',
          panel: '#12141D',
          card: '#181B26',
          border: '#262A3B',
          accent: '#E11D48',
          accentHover: '#F43F5E',
          muted: '#8E95AB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-red': '0 0 20px rgba(225, 29, 72, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      }
    },
  },
  plugins: [],
}
