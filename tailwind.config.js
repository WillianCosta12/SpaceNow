/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030308',
          900: '#07071A',
          800: '#0D0D2B',
          700: '#12123D',
          600: '#1A1A5E',
        },
        nebula: {
          DEFAULT: '#7C3AED',
          light:   '#A78BFA',
          muted:   'rgba(124, 58, 237, 0.15)',
          border:  'rgba(124, 58, 237, 0.3)',
        },
        star: {
          DEFAULT: '#F8FAFC',
          muted:   '#94A3B8',
          dim:     '#475569',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':  'spin 20s linear infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
