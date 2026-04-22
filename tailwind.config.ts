import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bone: '#F9F9F7',
        ink: '#1A1A1A',
        grey: '#7D7D7D',
        border: '#E2E2E2',
        'ink-muted': 'rgba(26,26,26,0.5)',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'fluid-hero': 'clamp(2rem, 8vw, 12rem)',
        'fluid-title': 'clamp(1.5rem, 4vw, 5rem)',
        'fluid-h2': 'clamp(1.25rem, 2.5vw, 3rem)',
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.01em',
        wide: '0.08em',
        wider: '0.16em',
      },
      aspectRatio: {
        poster: '2 / 3',
      },
      animation: {
        shimmer: 'shimmer 1.6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backgroundImage: {
        'shimmer-gradient':
          'linear-gradient(90deg, #EBEBEB 25%, #F5F5F5 50%, #EBEBEB 75%)',
      },
      boxShadow: {
        'card-hover': '0 4px 40px rgba(0,0,0,0.06)',
        'card-subtle': '0 2px 16px rgba(0,0,0,0.03)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}

export default config
