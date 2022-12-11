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
        canvas: "#1A1C1E",
        headline: "#E1E3E7",
        topAppBar: "#45474B",
        paper: "#2E3034",
        toggle: "#6B7C8C",
        input: "#282E35",
        // gray: {
        //   50: colors.neutral[50],
        //   100: colors.neutral[100],
        //   200: colors.neutral[200],
        //   300: colors.neutral[300],
        //   400: colors.neutral[400],
        //   500: colors.neutral[500],
        //   600: colors.neutral[600],
        //   700: colors.neutral[700],
        //   800: colors.neutral[800],
        //   900: colors.neutral[900],
        // },
        // gray: {
        //   50: "#ebf1f8",
        //   100: "#dde3ea",
        //   200: "#c1c7ce",
        //   300: "#a5acb2",
        //   400: "#8b9297",
        //   500: "#71787e",
        //   600: "#585f65",
        //   700: "#45474B",
        //   800: "#2E3034",
        //   900: "#1A1C1E",
        // },
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
        // from MD3 color designer: neutral #2
        // gray: {
        //   50: "#f0f0f4",
        //   100: "#e2e2e5",
        //   200: "#c6c6c9",
        //   300: "#aaabae",
        //   400: "#909194",
        //   500: "#76777a",
        //   600: "#5d5e61",
        //   700: "#45474a",
        //   800: "#2f3033",
        //   900: "#1a1c1e",
        // },
        // from MD3 color designer: neutral variant
        // gray: {
        //   50: "#ecf1f9",
        //   100: "#dee3eb",
        //   200: "#c2c7cf",
        //   300: "#a7acb3",
        //   400: "#8c9198",
        //   500: "#72777f",
        //   600: "#5a5f66",
        //   700: "#42474e",
        //   800: "#2c3137",
        //   900: "#171c22",
        // },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
