import type { Config } from "tailwindcss";

const flowbite = require("flowbite-react/tailwind");

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        grey : "#7C7F84",
        primary : "#6B7B4E",
        "primary-dark": "#5A6840",
        "primary-light": "#8A9B6E",
        secondary: "#C17F4E",
        "secondary-dark": "#A66B3D",
        accent: "#4A3728",
        cream: "#FDF8F3",
        "cream-dark": "#F5EDE3"
      },
      typography: {
        DEFAULT: {
          css: {
            overflowWrap: "anywhere",
          },
        },
      },
    },
    fontFamily: {
      'acme' : ["Acme", "sans-serif"],
      "adlm" : ["ADLaM Display", "system-ui"]
    },
    animation : {
      slideUp : "slideUp 0.5s ease-out",
      slideDown : "slideDown 0.5s ease-out",
      slideRight : "slideRight 0.25s ease-in-out",
      slideLeft : "slideLeft 0.25s ease-in-out"
    },
    keyframes : {
      slideUp: {
        "0%": { transform: "translateY(50px)", opacity: "0" },
        "100%": { transform: "translateY(0)", opacity: "1" },
      },
      slideDown : {
        "0%": { transform: "translateY(0)", opacity: "1" },
        "100%": { transform: "translateY(50px)", opacity: "0" },
      },
      slideRight: {
        "0%": { transform: "translateX(100%)", opacity: "0" },
        "100%": { transform: "translateX(0)", opacity: "1" },
      },
      slideLeft: {
        "0%": { transform: "translateX(0)", opacity: "1" },
        "100%": { transform: "translateX(100%)", opacity: "0" },
      },
    }
  },
  plugins: [
    flowbite.plugin(),
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
