/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#050505',
          card: '#0E0E0E',
          border: '#2A2A2A',
          primary: '#F97316',
          secondary: '#EAB308',
          success: '#22C55E',
          danger: '#EF4444',
          muted: '#71717A',
          grid: '#18181B',
        }
      },
      fontFamily: {
        heading: ['"Outfit"', 'sans-serif'],
        condensed: ['"Roboto Condensed"', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      borderRadius: {
        'brutalist': '20px',
      },
      borderWidth: {
        'brutalist': '2px',
      },
      boxShadow: {
        'brutalist-orange': '4px 4px 0px 0px #F97316',
        'brutalist-yellow': '4px 4px 0px 0px #EAB308',
        'brutalist-border': '4px 4px 0px 0px #2A2A2A',
        'glow-orange': '0 0 15px rgba(249, 115, 22, 0.15)',
      }
    },
  },
  plugins: [],
}
