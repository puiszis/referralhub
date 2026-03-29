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
        cream: { 50: "#FFFDF7", 100: "#FFF9E8", 200: "#FFF3D1", 300: "#FFEBB3" },
        amber: { 50: "#FFFBEB", 100: "#FEF3C7", 200: "#FDE68A", 300: "#FCD34D", 400: "#FBBF24", 500: "#F59E0B", 600: "#D97706", 700: "#B45309", 800: "#92400E", 900: "#78350F" },
        earth: { 50: "#FAF6F1", 100: "#F0E8DC", 200: "#E1D1B9", 300: "#C9B48E", 400: "#B59A6E", 500: "#9C7C4E", 600: "#7D6240", 700: "#5E4A30", 800: "#3F3120", 900: "#2A2115" },
        olive: { 50: "#F7F8F0", 100: "#EDF0DA", 200: "#D9E0B0", 300: "#BCC880", 400: "#9FB05A", 500: "#7D9140", 600: "#617330", 700: "#4A5825", 800: "#343D1B", 900: "#252C13" },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.1" }],
        "heading": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.2" }],
      },
    },
  },
  plugins: [],
};
export default config;
