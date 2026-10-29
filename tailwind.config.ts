import type { Config } from "tailwindcss";

const color = (token: string) => `rgb(var(--${token}-rgb) / <alpha-value>)`;
const neutral = {
  50: color("bg"),
  100: color("bg"),
  200: color("border"),
  300: color("text-muted"),
  400: color("text-muted"),
  500: color("text-muted"),
  600: color("text-muted"),
  700: color("text"),
  800: color("text"),
  900: color("text"),
  950: color("text"),
};
const accentScale = {
  50: color("bg"),
  100: color("bg"),
  200: color("border"),
  300: color("accent"),
  400: color("accent"),
  500: color("accent"),
  600: color("accent-hover"),
  700: color("accent-hover"),
  800: color("text"),
  900: color("text"),
  950: color("text"),
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    // Replace Tailwind's default palette so all generated color utilities use approved tokens.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
      white: color("surface"),
      black: color("bg"),
      bg: color("bg"),
      surface: {
        DEFAULT: color("surface"),
        muted: color("bg"),
        alternate: color("bg"),
        border: color("border"),
      },
      border: color("border"),
      text: {
        DEFAULT: color("text"),
        muted: color("text-muted"),
      },
      accent: {
        DEFAULT: color("accent"),
        hover: color("accent-hover"),
        red: color("accent"),
        blue: color("accent"),
        amber: color("accent"),
      },
      dark: color("dark"),
      darkText: color("dark-text"),
      paper: {
        DEFAULT: color("text"),
        muted: color("text-muted"),
        dim: color("text-muted"),
      },
      ink: {
        DEFAULT: color("text"),
        soft: color("bg"),
        card: color("surface"),
        deep: color("bg"),
      },
      muted: {
        DEFAULT: color("text-muted"),
        dark: color("text-muted"),
        deep: color("text-muted"),
      },
      canvas: {
        DEFAULT: color("bg"),
        raised: color("surface"),
        deep: color("border"),
      },
      char: {
        DEFAULT: color("text"),
        soft: color("text-muted"),
        faint: color("text-muted"),
      },
      brass: {
        DEFAULT: color("accent"),
        light: color("text-muted"),
        deep: color("accent"),
      },
      live: color("accent"),
      content: {
        DEFAULT: color("text"),
        muted: color("text-muted"),
        subtle: color("text-muted"),
      },
      brand: {
        DEFAULT: color("accent"),
        deep: color("accent-hover"),
        light: color("text-muted"),
        primary: color("accent"),
        muted: color("text-muted"),
      },
      zinc: neutral,
      slate: neutral,
      gray: neutral,
      neutral,
      stone: neutral,
      emerald: accentScale,
      green: accentScale,
      teal: accentScale,
      blue: accentScale,
      indigo: accentScale,
      violet: accentScale,
      purple: accentScale,
      pink: accentScale,
      rose: accentScale,
      red: accentScale,
      amber: accentScale,
      yellow: accentScale,
      orange: accentScale,
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-body)"],
        serif: ["var(--font-body)"],
        mono: ["var(--font-body)"],
        logo: ["var(--font-body)"],
      },
      borderRadius: {
        card: "var(--radius-card)",
        panel: "var(--radius-card)",
      },
      boxShadow: {
        soft: "var(--shadow-card)",
        lift: "var(--shadow-card)",
        glow: "var(--shadow-card)",
      },
      maxWidth: { shell: "var(--shell)" },
      transitionTimingFunction: {
        expo: "var(--ease-standard)",
      },
      animation: {
        "reveal-in": "page-enter 300ms ease both",
        "fade-in": "page-enter 300ms ease both",
        "pulse-ring": "none",
        "hero-kenburns": "none",
        "mesh-drift": "none",
      },
      keyframes: {
        "page-enter": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
