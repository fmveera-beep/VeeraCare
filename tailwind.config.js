/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          DEFAULT: "#4058B0",
          navy: "#2A4394",
          mid: "#5569B8",
          light: "#7F93C6",
          pale: "#CED6EE",
          tint: "#E6EAF8",
          foreground: "#FFFFFF",
        },
        peach: "#E6EAF8",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
