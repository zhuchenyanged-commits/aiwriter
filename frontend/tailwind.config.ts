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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // 赛博朋克配色
        cyber: {
          black: '#0a0a0f',
          dark: '#13131f',
          cyan: '#00f5ff',
          purple: '#b000ff',
          pink: '#ff00aa',
          blue: '#0066ff',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #00f5ff, #b000ff)',
        'gradient-secondary': 'linear-gradient(135deg, #ff00aa, #00f5ff)',
        'gradient-glow': 'radial-gradient(circle at center, rgba(176, 0, 255, 0.15), transparent 70%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'border-flow': 'border-flow 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(0, 245, 255, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(176, 0, 255, 0.8)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'border-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 245, 255, 0.5), 0 0 20px rgba(0, 245, 255, 0.3)',
        'neon-purple': '0 0 10px rgba(176, 0, 255, 0.5), 0 0 20px rgba(176, 0, 255, 0.3)',
        'neon-pink': '0 0 10px rgba(255, 0, 170, 0.5), 0 0 20px rgba(255, 0, 170, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}
export default config
