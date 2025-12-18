import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        navy: '#1E293B',
        neon: {
          purple: '#8B5CF6',
          pink: '#EC4899',
          cyan: '#06B6D4',
          green: '#10B981',
          gold: '#F59E0B',
          greenCyan: '#1bb388'
        }
      },
      boxShadow: {
        glow: '0 0 30px rgba(139, 92, 246, 0.35)',
        glowPink: '0 0 30px rgba(236, 72, 153, 0.35)',
        glowCyan: '0 0 30px rgba(6, 182, 212, 0.35)',
        glowGreen: '0 0 30px rgba(16, 185, 129, 0.35)',
        glowGreenCyan: '0 0 30px rgba(27, 179, 136, 0.35)'
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-14px) translateX(10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        floaty: 'floaty 9s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
