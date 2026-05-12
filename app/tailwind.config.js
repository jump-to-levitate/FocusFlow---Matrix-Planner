/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonGreen: '#39FF14',
        neonPurple: '#A020F0',
        slate900: '#0f172a',
        slate800: '#1e293b',
        q1: '#FF4D4D',
        q2: '#39FF14',
        q3: '#FB923C',
        q4: '#64748B',
        panel: '#121212',
        panelBorder: '#2A2A2A',
        textSecondary: '#B0B0B0',
        midnight: '#000000',
      },
      borderRadius: {
        card: '18px',
        pill: '50px',
      },
      letterSpacing: {
        qlabel: '0.2em',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          'from': { 'box-shadow': '0 0 10px #39FF14, 0 0 20px #39FF14' },
          'to': { 'box-shadow': '0 0 20px #39FF14, 0 0 40px #39FF14' },
        }
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar-hide"),
  ],
}
