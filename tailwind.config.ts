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
        rpg: {
          navy: "#1a2744",
          dark: "#141f36",
          border: "#18243c",
          cream: "#f7f5ed",
          panel: "#faf8f2",
          surface: "#ede8d8",
          red: "#e24236",
          redHover: "#c83328",
          blue: "#2b75d6",
          water: "#3692dc",
          rock: "#9d8350",
          grass: "#59b54c",
          fire: "#f06535",
          electric: "#f3be2b",
          psychic: "#e55782",
          lightBadge: "#eef2f7",
          ashBg: "#e9f2fb",
          mistyBg: "#fcedec",
        },
      },
      fontFamily: {
        pixel: ["var(--font-press-start)", "monospace"],
        retro: ["var(--font-vt323)", "monospace"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        pixel: "4px 4px 0px 0px #18243c",
        pixelSm: "2px 2px 0px 0px #18243c",
        pixelLg: "6px 6px 0px 0px #18243c",
        pixelRed: "0px 4px 0px 0px #9f1c14",
      },
    },
  },
  plugins: [],
};

export default config;
