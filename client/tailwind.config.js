module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: "#ffff",
        background: "#181927",
        primary: "hsl(272, 56%, 74%, 5%)",
        secondary: "hsl(260, 73%, 36%, 20%)",
        accent: "#AB65ED",
        blue1: "#deecfc",
        blue2: "#9BC9FE",
        white1: "#F7F6FD",
        gray1: "",
        gray2: "#DFE0F2",
        // primary: "#0e0e15",
        // secondary: "#13141f",
        purple1: "#2b2150",
        purple2: "#874efd",
        purple3: "#241544",
        purple4: "#29194c",
        red1: "#c12d2e",
        green1: "#1b513c",
        greenDark1: "#132823",
        black1: "#0e0f12",
        borderColor1: "#313142",
        blue3: "#2f0c69",
      },
      fontFamily: {
        poker1: ["Poppins", "sans-serif"],
      },
      borderWidth: {
        borderWidth: ".1em",
      },
    },
  },
  plugins: [],
};
