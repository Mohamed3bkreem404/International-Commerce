import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      borderRadius: {
        xl: "1rem",
        "2xl": "1.4rem",
        "3xl": "1.8rem",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "sans-serif"],
        display: ["var(--font-playfair)", "ui-serif", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        premium: "0 24px 60px rgba(15, 23, 42, 0.12)",
        soft: "0 12px 32px rgba(15, 23, 42, 0.08)",
        innerGlow: "inset 0 1px 0 rgba(255, 255, 255, 0.55)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".82" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s ease-out",
        "pulse-soft": "pulse-soft 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
