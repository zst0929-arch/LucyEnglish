import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#fbf7ec",
        cloud: "#eef7f8",
        mint: "#d8eee5",
        skysoft: "#bfdff2",
        wood: "#d9b98b",
        ink: "#29383a",
        tea: "#f36b2a"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Noto Sans SC", "sans-serif"],
        display: ["var(--font-display)", "Noto Sans SC", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(47, 58, 60, 0.10)",
        card: "0 18px 45px rgba(47, 58, 60, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
