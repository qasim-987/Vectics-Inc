import type { Config } from "tailwindcss";

/**
 * FORZA / VECTIS — DESIGN TOKENS
 * ---------------------------------------------------------------------------
 * Every colour below resolves to an RGB CSS custom property declared in
 * src/app/globals.css. The `rgb(var(--x) / <alpha-value>)` form keeps Tailwind's
 * opacity modifiers (e.g. `bg-ink-soft/90`, `text-paper/70`) working while the
 * actual palette lives in one place. See DESIGN.md for the full hex palette.
 */
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
        // Light text on navy surfaces
        paper: {
          DEFAULT: "rgb(var(--paper-rgb) / <alpha-value>)",
          muted: "rgb(var(--paper-muted-rgb) / <alpha-value>)",
          dim: "rgb(var(--paper-dim-rgb) / <alpha-value>)",
        },
        // Deep ink / night-operations family (dark backgrounds)
        ink: {
          DEFAULT: "rgb(var(--ink-rgb) / <alpha-value>)",
          soft: "rgb(var(--ink-soft-rgb) / <alpha-value>)",
          card: "rgb(var(--ink-card-rgb) / <alpha-value>)",
          deep: "rgb(var(--ink-deep-rgb) / <alpha-value>)",
        },
        // Neutral secondary text
        muted: {
          DEFAULT: "rgb(var(--muted-rgb) / <alpha-value>)",
          dark: "rgb(var(--muted-dark-rgb) / <alpha-value>)",
          deep: "rgb(var(--muted-deep-rgb) / <alpha-value>)",
        },
        // Light-section surfaces and their ink
        canvas: {
          DEFAULT: "rgb(var(--canvas-rgb) / <alpha-value>)",
          raised: "rgb(var(--canvas-raised-rgb) / <alpha-value>)",
          deep: "rgb(var(--canvas-deep-rgb) / <alpha-value>)",
        },
        char: {
          DEFAULT: "rgb(var(--char-rgb) / <alpha-value>)",
          soft: "rgb(var(--char-soft-rgb) / <alpha-value>)",
          faint: "rgb(var(--char-faint-rgb) / <alpha-value>)",
        },
        // Legacy `brass` names now point to the restrained blue accent.
        brass: {
          DEFAULT: "rgb(var(--brass-rgb) / <alpha-value>)",
          light: "rgb(var(--brass-light-rgb) / <alpha-value>)",
          deep: "rgb(var(--brass-deep-rgb) / <alpha-value>)",
        },
        live: "rgb(var(--live-rgb) / <alpha-value>)",
        // Semantic aliases for the light product, company and contact pages.
        surface: {
          DEFAULT: "rgb(var(--canvas-raised-rgb) / <alpha-value>)",
          muted: "rgb(var(--canvas-rgb) / <alpha-value>)",
          alternate: "rgb(var(--canvas-deep-rgb) / <alpha-value>)",
          border: "rgb(var(--surface-border-rgb) / <alpha-value>)",
        },
        content: {
          DEFAULT: "rgb(var(--char-rgb) / <alpha-value>)",
          muted: "rgb(var(--char-soft-rgb) / <alpha-value>)",
          subtle: "rgb(var(--char-faint-rgb) / <alpha-value>)",
        },
        brand: {
          DEFAULT: "rgb(var(--brass-deep-rgb) / <alpha-value>)",
          deep: "rgb(var(--brand-deep-rgb) / <alpha-value>)",
          light: "rgb(var(--brass-light-rgb) / <alpha-value>)",
          primary: "rgb(var(--brass-light-rgb) / <alpha-value>)",
          muted: "rgb(var(--brand-muted-rgb) / <alpha-value>)",
        },
        // Legacy accent aliases, including validation/error states.
        accent: {
          red: "rgb(var(--accent-red-rgb) / <alpha-value>)",
          blue: "rgb(var(--accent-blue-rgb) / <alpha-value>)",
          amber: "rgb(var(--brass-light-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-display)", "Instrument Serif", "Newsreader", "Georgia", "serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "ui-monospace", "monospace"],
        logo: ["var(--font-logo)", "Outfit", "sans-serif"],
      },
      borderRadius: {
        card: "var(--radius-card)",
        panel: "var(--radius-panel)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        lift: "var(--shadow-lift)",
        glow: "var(--shadow-glow)",
      },
      maxWidth: {
        shell: "var(--shell)",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      animation: {
        "reveal-in": "reveal-in .85s cubic-bezier(.22,1,.36,1) forwards",
        "hero-kenburns": "hero-kenburns 28s ease-in-out infinite alternate",
        "hero-enter": "hero-enter .72s cubic-bezier(.22,1,.36,1) forwards",
        "nano-draw": "nano-draw 2.2s ease-out forwards",
        progress: "progress var(--slide-duration, 5600ms) linear forwards",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(.22,1,.36,1) infinite",
        "spin-slow": "spin-slow 26s linear infinite",
        "mesh-drift": "mesh-drift 22s ease-in-out infinite alternate",
        "float-y": "float-y 3.4s ease-in-out infinite",
        "scroll-cue": "scroll-cue 2.2s cubic-bezier(.22,1,.36,1) infinite",
        "shine-sweep": "shine-sweep 1s cubic-bezier(.22,1,.36,1)",
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
        progress: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "pulse-ring": {
          "0%": { opacity: "0.7", transform: "scale(0.7)" },
          "70%": { opacity: "0", transform: "scale(2.2)" },
          "100%": { opacity: "0", transform: "scale(2.2)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "mesh-drift": {
          "0%": { transform: "translate3d(-4%, -2%, 0) scale(1)" },
          "100%": { transform: "translate3d(6%, 4%, 0) scale(1.12)" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(7px)" },
        },
        "scroll-cue": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "35%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateY(18px)" },
        },
        "shine-sweep": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
