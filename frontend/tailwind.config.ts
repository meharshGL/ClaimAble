import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#EFEDE6",
        "paper-line": "#DEDACB",
        ink: "#1B2340",
        "ink-soft": "#4B5170",
        stamp: {
          approved: "#2F6D4F",
          "approved-bg": "#E4EEE7",
          rejected: "#9B3B3B",
          "rejected-bg": "#F3E4E2",
          pending: "#B5792B",
          "pending-bg": "#F4E8D6",
          investigate: "#3A4E8C",
          "investigate-bg": "#E3E7F2",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        ledger:
          "repeating-linear-gradient(to bottom, transparent, transparent 35px, #DEDACB 36px)",
      },
    },
  },
  plugins: [],
};
export default config;
