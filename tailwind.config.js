/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          DEFAULT: "#4A5CA8",
          navy: "#32448E",
          mid: "#5F6FB5",
          light: "#8A9BC4",
          pale: "#D6DCF0",
          tint: "#ECF0F7",
          foreground: "#FFFFFF",
        },
        peach: "#ECF0F7",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
