/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfitBold: ["outfitBold", "sans-serif"],
        outfitMedium: ["outfitMedium", "sans-serif"],
        workSans: ["workSans", "sans-serif"],
        workSansSBI: ["workSansSBI", "sans-serif"],
      },
      screens: {
        1920: "1920px",
      },
      saturate: {
        25: ".25",
      },
      letterSpacing: {
        heading: "-0.025em",
      },
      backgroundSize: {
        patternSize: "1%",
      },
      borderRadius: {
        ellipse: "50%",
      },
      scale: {
        160: "1.60",
      },
      colors: {
        text: "#ffff",
        bg: "#0C0517",
        primary: "#9337C7",
        secondary: "#1C1625",
        accent: "#CC8DEF",
        border: "hsl(277,96%,80%,40%)",
        black1: "#222222",
        purple1: "#674B7B",
        red1: "#c12d2e",
        green1: "#1b513c",
      },
      fontSize: {
        "heading-desktop": "5.5rem",
        "heading-laptop": "4rem",
        "heading-mobile": "2rem",
      },
      borderWidth: {
        borderWidth: ".1em",
      },
    },
  },
  plugins: [],
};
