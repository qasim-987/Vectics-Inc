import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#f2efe9",
          muted: "#e8e3d9",
          dim: "#d9d4c7",
        },
        ink: {
          DEFAULT: "#1a1a1a",
          soft: "#1c1917",
          card: "#24211e",
          deep: "#141210",
        },
        muted: {
          DEFAULT: "#9b9590",
          dark: "#6b6560",
          deep: "#4a4540",
        },
        accent: {
          red: "#e63946",
          blue: "#3b82f6",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Instrument Sans", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-serif)", "Newsreader", "Georgia", "serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "ui-monospace", "monospace"],
        logo: ["var(--font-logo)", "Outfit", "sans-serif"],
      },
      animation: {
        "reveal-in": "reveal-in .85s cubic-bezier(.22,1,.36,1) forwards",
        "hero-kenburns": "hero-kenburns 28s ease-in-out infinite alternate",
        "hero-enter": "hero-enter .72s cubic-bezier(.22,1,.36,1) forwards",
        "nano-draw": "nano-draw 2.2s ease-out forwards",
      },
      keyframes: {
        "reveal-in": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "none" },
        },
        "hero-kenburns": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.055)" },
        },
        "hero-enter": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "none" },
        },
        "nano-draw": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
