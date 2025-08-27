import type { Config } from "tailwindcss";

const flowbite = require("flowbite-react/tailwind");

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        surface: "var(--color-surface)",     // Ensure surface is here
        border: "var(--color-border)",  

        // Primary Color Shades
        primary: {
          50: "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
          DEFAULT: "var(--color-primary)", // Optional: set a default
        },

        // Secondary Color Shades
        secondary: {
          50: "var(--color-secondary-50)",
          100: "var(--color-secondary-100)",
          200: "var(--color-secondary-200)",
          300: "var(--color-secondary-300)",
          400: "var(--color-secondary-400)",
          500: "var(--color-secondary-500)",
          600: "var(--color-secondary-600)",
          700: "var(--color-secondary-700)",
          800: "var(--color-secondary-800)",
          900: "var(--color-secondary-900)",
          DEFAULT: "var(--color-secondary)",
        },

        // Success Color Shades
        success: {
          50: "var(--color-success-50)",
          100: "var(--color-success-100)",
          200: "var(--color-success-200)",
          300: "var(--color-success-300)",
          400: "var(--color-success-400)",
          500: "var(--color-success-500)",
          600: "var(--color-success-600)",
          700: "var(--color-success-700)",
          800: "var(--color-success-800)",
          900: "var(--color-success-900)",
          DEFAULT: "var(--color-success)",
        },

        // Warning Color Shades
        warning: {
          50: "var(--color-warning-50)",
          100: "var(--color-warning-100)",
          200: "var(--color-warning-200)",
          300: "var(--color-warning-300)",
          400: "var(--color-warning-400)",
          500: "var(--color-warning-500)",
          600: "var(--color-warning-600)",
          700: "var(--color-warning-700)",
          800: "var(--color-warning-800)",
          900: "var(--color-warning-900)",
          DEFAULT: "var(--color-warning)",
        },

        // Danger Color Shades
        danger: {
          50: "var(--color-danger-50)",
          100: "var(--color-danger-100)",
          200: "var(--color-danger-200)",
          300: "var(--color-danger-300)",
          400: "var(--color-danger-400)",
          500: "var(--color-danger-500)",
          600: "var(--color-danger-600)",
          700: "var(--color-danger-700)",
          800: "var(--color-danger-800)",
          900: "var(--color-danger-900)",
          DEFAULT: "var(--color-danger)",
        },

        // Info Color Shades
        info: {
          50: "var(--color-info-50)",
          100: "var(--color-info-100)",
          200: "var(--color-info-200)",
          300: "var(--color-info-300)",
          400: "var(--color-info-400)",
          500: "var(--color-info-500)",
          600: "var(--color-info-600)",
          700: "var(--color-info-700)",
          800: "var(--color-info-800)",
          900: "var(--color-info-900)",
          DEFAULT: "var(--color-info)",
        },

        // Help Color Shades
        help: {
          50: "var(--color-help-50)",
          100: "var(--color-help-100)",
          200: "var(--color-help-200)",
          300: "var(--color-help-300)",
          400: "var(--color-help-400)",
          500: "var(--color-help-500)",
          600: "var(--color-help-600)",
          700: "var(--color-help-700)",
          800: "var(--color-help-800)",
          900: "var(--color-help-900)",
          DEFAULT: "var(--color-help)",
        },

        gray: { // Ensure all shades are mapped
          50: "var(--color-grey-50)",
          100: "var(--color-grey-100)",
          200: "var(--color-grey-200)",
          300: "var(--color-secondary-300)",
          400: "var(--color-grey-400)",
          500: "var(--color-grey-500)",
          600: "var(--color-grey-600)",
          700: "var(--color-grey-700)",
          800: "var(--color-grey-800)",
          900: "var(--color-grey-900)",
        },
      },
    },
    spacing: { // Example spacing scale
      '0': '0',
      '0.5' : '0.125rem',
      '1': '0.25rem',
      '1.5': '0.375rem',
      '2': '0.5rem',
      '2.5': '0.625rem',
      '3': '0.75rem',
      '3.5': '0.875rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '8': '2rem',
      '9' : '2.25rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem',
      // Add more as needed
    },
    boxShadow: { // Example box shadows
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      // Add more as needed
    },
    borderRadius: { // Example border radius
      'none': '0',
      'sm': '0.125rem',
      'md': '0.375rem',
      'lg': '0.5rem',
      'xl': '0.75rem',
      'full': '9999px',
    }
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".break-anywhere": {
          overflowWrap: "anywhere",
          wordBreak: "break-word", // Optional fallback
        },
      });
    },
  ],
} satisfies Config;
