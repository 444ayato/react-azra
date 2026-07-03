/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "fade-out": {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        "zoom-in-95": {
          from: { opacity: 0, transform: "scale(0.95)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        "zoom-out-95": {
          from: { opacity: 1, transform: "scale(1)" },
          to: { opacity: 0, transform: "scale(0.95)" },
        },
        "slide-in-from-top-48": {
          from: { transform: "translateY(-48%)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        "slide-out-to-top-48": {
          from: { transform: "translateY(0)", opacity: 1 },
          to: { transform: "translateY(-48%)", opacity: 0 },
        },
        "slide-in-from-left-1/2": {
          from: { transform: "translateX(-50%)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
        "slide-out-to-left-1/2": {
          from: { transform: "translateX(0)", opacity: 1 },
          to: { transform: "translateX(-50%)", opacity: 0 },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "zoom-in-95": "zoom-in-95 0.2s ease-out",
        "zoom-out-95": "zoom-out-95 0.2s ease-out",
        "slide-in-from-top-48": "slide-in-from-top-48 0.2s ease-out",
        "slide-out-to-top-48": "slide-out-to-top-48 0.2s ease-out",
        "slide-in-from-left-1/2": "slide-in-from-left-1/2 0.2s ease-out",
        "slide-out-to-left-1/2": "slide-out-to-left-1/2 0.2s ease-out",
        "in": "fade-in 0.2s ease-out",
        "out": "fade-out 0.2s ease-out",
      },
    },
  },
  plugins: [],
}