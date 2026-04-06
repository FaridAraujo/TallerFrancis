/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black:    '#050505',
          red:      '#c0392b',
          'red-h':  '#e74c3c',
          'red-d':  '#962d22',
          burn:     '#e67e22',
          'burn-h': '#f39c12',
          bg:       '#0a0a0a',
          surface:  '#1a1a1a',
          raised:   '#242424',
          border:   '#333333',
          hover:    '#2d2d2d',
          muted:    '#404040',
        },
      },
      fontFamily: {
        sans:     ['Poppins', 'sans-serif'],
        mono:     ['IBM Plex Mono', 'Courier Prime', 'monospace'],
        courier:  ['Courier Prime', 'monospace'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.5s ease-out',
        fadeIn: 'fadeIn 0.4s ease-out',
        slideInRight: 'slideInRight 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
