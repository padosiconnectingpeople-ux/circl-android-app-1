/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          DEFAULT: '#5B4FE8',
          light: '#E3DFFF',
          dark: '#3824C7',
          container: '#5B4FE8',
          fixed: '#E3DFFF',
          'fixed-dim': '#C4C0FF',
        },
        secondary: {
          DEFAULT: '#FF6B35',
          light: '#FFDBD0',
          dark: '#AB3500',
          container: '#FE6A34',
        },
        tertiary: {
          DEFAULT: '#22C55E',
          dark: '#005D26',
          container: '#007834',
        },
        // Semantic Colors
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        error: {
          DEFAULT: '#BA1A1A',
          container: '#FFDAD6',
        },
        // Surface Colors
        surface: {
          DEFAULT: '#FCF8FF',
          dim: '#DCD8E5',
          bright: '#FCF8FF',
          container: {
            DEFAULT: '#F0ECF9',
            low: '#F6F1FF',
            high: '#EBE6F4',
            highest: '#E5E0EE',
            lowest: '#FFFFFF',
          },
          variant: '#E5E0EE',
          tint: '#5244DE',
        },
        // On-Surface Colors
        'on-surface': {
          DEFAULT: '#1C1A24',
          variant: '#464555',
        },
        'on-primary': '#FFFFFF',
        'on-secondary': '#FFFFFF',
        'on-tertiary': '#FFFFFF',
        'on-error': '#FFFFFF',
        'on-background': '#1C1A24',
        // Background
        background: '#F8F9FF',
        card: '#FFFFFF',
        // Text
        text: {
          DEFAULT: '#0F0E17',
          sub: '#6B7280',
          muted: '#777586',
        },
        // Outline
        outline: {
          DEFAULT: '#777586',
          variant: '#C8C4D8',
        },
        // Inverse
        'inverse-surface': '#312F39',
        'inverse-on-surface': '#F3EFFC',
        'inverse-primary': '#C4C0FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '500' }],
        'label-sm': ['11px', { lineHeight: '14px', fontWeight: '600' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'gutter': '12px',
        'container-margin': '16px',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'chip': '100px',
        'input': '12px',
      },
      boxShadow: {
        'card': '0 4px 12px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 20px 0 rgba(0, 0, 0, 0.10)',
        'nav': '0 -4px 12px 0 rgba(0, 0, 0, 0.06)',
        'fab': '0 4px 12px 0 rgba(91, 79, 232, 0.3)',
        'modal': '0 -8px 30px 0 rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-dot': 'pulseDot 1.6s ease-in-out infinite',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        skeleton: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
