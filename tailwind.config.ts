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
        // Dark surfaces are reserved for the navigation, hero and footer.
        paper: {
          DEFAULT: "#f8fafc",
          muted: "#e4edf4",
          dim: "#c7d5e1",
        },
        ink: {
          DEFAULT: "#122b42",
          soft: "#10263a",
          card: "#1c364d",
          deep: "#0b1d2d",
        },
        muted: {
          DEFAULT: "#b6c6d2",
          dark: "#9fb2c1",
          deep: "#8fa3b3",
        },
        // The main content uses light surfaces with navy and slate text.
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f3f6f9",
          alternate: "#eaf0f5",
          border: "#d6e0e8",
        },
        content: {
          DEFAULT: "#172d43",
          muted: "#4b6175",
          subtle: "#5c7184",
        },
        brand: {
          DEFAULT: "#285f85",
          deep: "#1b496b",
          light: "#a9cfe2",
          // Used by legacy dark pages.
          primary: "#a9cfe2",
          muted: "#83aabf",
        },
        accent: {
          red: "#b8444d",
          blue: "#78a9ca",
          amber: "#a9cfe2",
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
