/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C1B47',
        secondary: '#8B5A8C',
        accent: '#D4AF37',
        surface: '#1A1125',
        background: '#0D0815',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3'
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Crimson Pro', 'serif'],
        sans: ['Crimson Pro', 'serif'],
        heading: ['Cinzel', 'serif']
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': {
            opacity: 1,
            boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.7)'
          },
          '50%': {
            opacity: 0.8,
            boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'glow': {
          '0%': { 
            boxShadow: '0 0 5px rgba(212, 175, 55, 0.5)',
            transform: 'scale(1)'
          },
          '100%': { 
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.8)',
            transform: 'scale(1.05)'
          }
        }
      }
    },
  },
  plugins: [],
}