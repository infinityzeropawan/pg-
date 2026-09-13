import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          subtle: 'var(--primary-subtle)',
        },
        bg: {
          page: 'var(--bg-page)',
          card: 'var(--bg-card)',
          sidebar: 'var(--bg-sidebar)',
          header: 'var(--bg-header)',
          input: 'var(--bg-input)',
          floating: 'var(--bg-floating)',
          overlay: 'var(--bg-overlay)',
          popover: 'var(--bg-popover)',
        },
        border: {
          DEFAULT: 'var(--border)',
          focus: 'var(--border-focus)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          disabled: 'var(--text-disabled)',
        },
        skeleton: {
          base: 'var(--skeleton-base)',
          highlight: 'var(--skeleton-highlight)',
        },
        success: {
          DEFAULT: 'var(--success)',
          bg: 'var(--success-bg)',
          text: 'var(--success-text)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          bg: 'var(--warning-bg)',
          text: 'var(--warning-text)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          bg: 'var(--danger-bg)',
          text: 'var(--danger-text)',
        },
        info: {
          DEFAULT: 'var(--info)',
          bg: 'var(--info-bg)',
          text: 'var(--info-text)',
        },
        purple: {
          DEFAULT: 'var(--purple)',
          bg: 'var(--purple-bg)',
        },
        pay: {
          cash: 'var(--pay-cash)',
          upi: 'var(--pay-upi)',
          card: 'var(--pay-card)',
          bank: 'var(--pay-bank)',
        }
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
        xslow: '500ms',
      },
    },
  },
  plugins: [],
};

export default config;
