/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Background layers — visually distinct, not flat black
        bg:       '#111111',   // page background
        surface:  '#1a1a1a',   // cards / panels
        raised:   '#222222',   // table headers, toolbars
        elevated: '#2a2a2a',   // hover states, focused rows

        // Borders
        line:  '#303030',
        lineh: '#484848',

        // Metallic red — matched to logo (deep crimson)
        accent: {
          DEFAULT: '#a82318',
          hover:   '#be2a1d',
          muted:   '#2a0c09',
          text:    '#d44030',
        },

        // Metallic silver — secondary text & labels
        metal: {
          DEFAULT: '#a4acb8',
          light:   '#c8cfd8',
          dim:     '#606870',
          faint:   '#252a30',
        },

        // Sidebar — slightly darker than page
        nav: {
          bg:     '#0d0d0d',
          border: '#1e1e1e',
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "'Segoe UI'", 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

