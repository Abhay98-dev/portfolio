/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#02040a',
          900: '#050814',
          850: '#090f22',
          800: '#0e1731',
          700: '#162347',
          600: '#23386d',
        },
        cyan: {
          neon: '#00f2fe',
          glow: '#00c6ff',
          dim: '#007299',
        },
        violet: {
          neon: '#9d4edd',
          glow: '#7928ca',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Orbitron', 'Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px -3px rgba(0, 242, 254, 0.35)',
        'cyan-glow-lg': '0 0 35px -2px rgba(0, 242, 254, 0.5)',
        'violet-glow': '0 0 25px -3px rgba(157, 78, 221, 0.4)',
        'hud-card': '0 8px 32px 0 rgba(0, 0, 0, 0.65)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
