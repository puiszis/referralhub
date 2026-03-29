import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        witch: {
          50: "#F5F0FF", 100: "#EDE5FF", 200: "#D4C4FF", 300: "#B49AFF",
          400: "#9470FF", 500: "#7C4DFF", 600: "#6930C3", 700: "#4A1D8E",
          800: "#2D1B4E", 900: "#1A0F2E", 950: "#0D0719",
        },
        gold: {
          50: "#FFFCF0", 100: "#FFF7D6", 200: "#FFECAD", 300: "#FFE085",
          400: "#FFD45C", 500: "#D4AF37", 600: "#B8962E", 700: "#8C7023",
          800: "#604B18", 900: "#34260D",
        },
        ember: {
          50: "#FFF5F0", 100: "#FFE8DB", 200: "#FFC9A8", 300: "#FFA575",
          400: "#FF7F42", 500: "#FF5A0F", 600: "#E04800", 700: "#A83500",
          800: "#702300", 900: "#381200",
        },
        earth: {
          50: "#FAF6F1", 100: "#F0E8DC", 200: "#E1D1B9", 300: "#C9B48E",
          400: "#B59A6E", 500: "#9C7C4E", 600: "#7D6240", 700: "#5E4A30",
          800: "#3F3120", 900: "#2A2115",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      fontSize: {
        hero: ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.1" }],
        heading: ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.2" }],
      },
    },
  },
  plugins: [],
};
export default config;
