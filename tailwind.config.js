/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4A90E2",
        secondary: "#F2994A",
        // secondary: {
        //   DEFAULT: "#F2994A",
        //   100: "#27AE60",
        //   200: "#1E854A",
        // },
        black: {
          DEFAULT: "#000",
          100: "#1E1E1E",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
        red: {
          100: "#EB5757",
          200: "#EB2929",
          300: "#DC0019",
        },
        background: "#F5F5F5"
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
