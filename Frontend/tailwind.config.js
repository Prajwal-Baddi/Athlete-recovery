/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        apex: {
          bg:      '#0a0e1a',
          bg2:     '#0f1526',
          bg3:     '#131d32',
          bg4:     '#182038',
          border:  'rgba(255,255,255,0.07)',
          border2: 'rgba(255,255,255,0.12)',
          green:   '#00d4aa',
          blue:    '#4a9eff',
          amber:   '#ffb347',
          red:     '#ff5f6d',
          purple:  '#a78bfa',
          cyan:    '#22d3ee',
          txt:     '#e8edf7',
          txt2:    '#8892a4',
          txt3:    '#4a5568',
        },
      },
      borderRadius: {
        'apex': '10px',
        'apex-lg': '14px',
        'apex-xl': '18px',
      },
      backgroundImage: {
        'apex-glow-green': 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)',
        'apex-glow-blue':  'radial-gradient(circle, rgba(74,158,255,0.08) 0%, transparent 70%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.35s ease both',
        'pulse-dot':  'pulseDot 2s ease-in-out infinite',
        'shimmer':    'shimmer 1.5s infinite',
        'spin-slow':  'spin 2s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%':     { opacity: '0.5', transform: 'scale(1.2)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 12px rgba(0,212,170,0.15)' },
          '50%':     { boxShadow: '0 0 28px rgba(0,212,170,0.35)' },
        },
      },
      boxShadow: {
        'apex-green': '0 0 20px rgba(0,212,170,0.15)',
        'apex-card':  '0 4px 24px rgba(0,0,0,0.4)',
        'apex-modal': '0 20px 60px rgba(0,0,0,0.7)',
      },
    },
  },
  plugins: [],
}
