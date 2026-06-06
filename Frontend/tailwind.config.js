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
          bg:      '#000000',
          bg2:     '#09090b', // Card backgrounds
          bg3:     '#121214', // Stat cards, subtle items
          bg4:     '#18181b', // Hover states
          border:  'rgba(255, 255, 255, 0.1)',
          border2: 'rgba(255, 255, 255, 0.15)',
          green:   '#10b981', // Emerald 500
          blue:    '#3b82f6', // Blue 500
          amber:   '#f59e0b', // Amber 500
          red:     '#ef4444', // Red 500
          purple:  '#8b5cf6', // Violet 500
          cyan:    '#0ea5e9', // Sky 500 / Cyan
          txt:     '#f8fafc', // Slate 50
          txt2:    '#a1a1aa', // Zinc 400
          txt3:    '#71717a', // Zinc 500
        },
      },
      borderRadius: {
        'apex': '8px',
        'apex-lg': '12px',
        'apex-xl': '16px',
      },
      animation: {
        'fade-up':    'fadeUp 0.35s ease both',
        'pulse-dot':  'pulseDot 2s ease-in-out infinite',
        'shimmer':    'shimmer 1.5s infinite',
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
      },
      boxShadow: {
        'apex-card':  '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'apex-modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
