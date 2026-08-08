/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./index.tsx','./App.tsx','./components/**/*.{ts,tsx}','./contexts/**/*.{ts,tsx}','./utils/**/*.{ts,tsx}','./config/**/*.{ts,tsx}','./types.ts'],
  theme: {
    extend: {
      colors: {
        madinah: {
          green: '#075c4b',
          gold: '#b08a3c',
          sand: '#f7f2e8',
          light: '#e3f0ec',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        kufi: ['Noto Kufi Arabic', 'sans-serif'],
        amiri: ['Amiri', 'serif'],
        aref: ['Aref Ruqaa', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(.22,1,.36,1)',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(.22,1,.36,1)',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(.22,1,.36,1)',
        'soft-float': 'softFloat 6s ease-in-out infinite',
        shake: 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        fadeIn: {'0%': {opacity:'0'},'100%': {opacity:'1'}},
        fadeInUp: {'0%': {opacity:'0',transform:'translateY(14px)'},'100%': {opacity:'1',transform:'translateY(0)'}},
        slideInRight: {'0%': {transform:'translateX(100%)'},'100%': {transform:'translateX(0)'}},
        slideInLeft: {'0%': {transform:'translateX(-100%)'},'100%': {transform:'translateX(0)'}},
        softFloat: {'0%,100%': {transform:'translateY(0)'},'50%': {transform:'translateY(-6px)'}},
        shake: {'0%,100%': {transform:'translateX(0)'},'10%,30%,50%,70%,90%': {transform:'translateX(-4px)'},'20%,40%,60%,80%': {transform:'translateX(4px)'}},
      },
    },
  },
  plugins: [],
};
