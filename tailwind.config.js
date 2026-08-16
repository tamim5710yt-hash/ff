/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0F0F12',
          800: '#16161B',
          700: '#1C1C22',
          600: '#24242C',
          500: '#2E2E38',
        },
        flame: {
          400: '#FF4D6A',
          500: '#FF003C',
          600: '#E60036',
          700: '#CC0030',
        },
        slatey: {
          400: '#3A3A45',
          500: '#2A2A33',
          600: '#22222A',
        },
        win: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
        warn: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        info: {
          400: '#60A5FA',
          500: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Oswald', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(255, 0, 60, 0.35)',
        glowSoft: '0 0 12px rgba(255, 0, 60, 0.25)',
      },
      keyframes: {
        pulseLive: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(255,0,60,0.6)' },
          '50%': { opacity: '0.85', boxShadow: '0 0 0 6px rgba(255,0,60,0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        pulseLive: 'pulseLive 1.6s ease-in-out infinite',
        slideUp: 'slideUp 0.25s ease-out',
        fadeIn: 'fadeIn 0.2s ease-out',
        scaleIn: 'scaleIn 0.18s ease-out',
      },
    },
  },
  plugins: [],
};
