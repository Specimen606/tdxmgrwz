import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF5EF',
          100: '#FFE8D9',
          200: '#FFD0B3',
          300: '#FFB185',
          400: '#FF9E66',
          500: '#FF7A45',
          600: '#F2621F',
          700: '#C94E14',
        },
        leaf: {
          400: '#73D13D',
          500: '#52C41A',
          600: '#389E0D',
        },
        ink: {
          900: '#1F2329',
          600: '#646A73',
          400: '#8F959E',
        },
      },
      fontFamily: {
        sans: ['PingFang SC', 'Microsoft YaHei', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 30px -8px rgba(255, 122, 69, 0.18)',
        soft: '0 4px 20px -6px rgba(31, 35, 41, 0.10)',
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop': {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '70%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'float': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.45s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'pop': 'pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'float': 'float 3.2s ease-in-out infinite',
        'spin-slow': 'spin-slow 2.4s linear infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
