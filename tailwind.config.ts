import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Palette
        void: '#050508',
        obsidian: '#0a0a10',
        onyx: '#12121c',
        graphite: '#1a1a28',
        slate: '#252536',

        // Accent Spectrum
        neural: {
          purple: '#8b5cf6',
        },
        synapse: {
          pink: '#d946ef',
        },
        memory: {
          blue: '#3b82f6',
        },

        // Glass System
        glass: {
          clear: 'rgba(255, 255, 255, 0.03)',
          frosted: 'rgba(255, 255, 255, 0.06)',
          solid: 'rgba(255, 255, 255, 0.10)',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(255, 255, 255, 0.15)',
        },
      },

      backgroundImage: {
        'gradient-neural': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 25%, #a855f7 50%, #d946ef 75%, #ec4899 100%)',
      },

      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },

      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
