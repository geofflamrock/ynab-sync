const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        ynab: {
          DEFAULT: "#85c3e9",
          50: "#e4f3ff",
          100: "#c5e7ff",
          200: "#7fd0ff",
          300: "#4eb5ea",
          400: "#299ace",
          500: "#0080ae",
          600: "#00658b",
          700: "#004c6a",
          800: "#00344a",
          900: "#001e2d",
        },
        // from MD3 color designer: neutral #1
        gray: {
          50: "#f0f1f3",
          100: "#e1e2e5",
          200: "#c5c6c9",
          300: "#aaabae",
          400: "#8f9193",
          500: "#75777a",
          600: "#5c5f61",
          700: "#454749",
          800: "#2e3133",
          900: "#191c1e",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
