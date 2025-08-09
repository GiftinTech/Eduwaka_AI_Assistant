/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          glow: 'hsl(var(--primary-glow))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          glow: 'hsl(var(--secondary-glow))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-card': 'var(--gradient-card)',
      },
      keyframes: {
        swirl: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'scroll-right': {
          '0%': { transform: 'translateX(calc(-50% + 2rem))' },
          '100%': { transform: 'translateX(0%)' },
        },
        'scroll-left': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(calc(-50% + 2rem))' },
        },
        'slide-in-dynamic-x': {
          '0%': {
            transform: 'translateX(var(--tw-slide-from-x, -100%))',
            opacity: '0',
          },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        swirl: 'swirl 8s ease infinite',
        'scroll-right': 'scroll-right 20s linear infinite',
        'scroll-left': 'scroll-left 20s linear infinite',
        'slide-in-dynamic-x': 'slide-in-dynamic-x 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};
