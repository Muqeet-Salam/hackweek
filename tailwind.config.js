export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FFF8E7",
        text: "#111111",
        primary: "#00B7FF",
        accent: "#FFD23F",
        pink: "#FF5D8F",
        green: "#7AE582",
        red: "#FF595E",
      },
      boxShadow: {
        brutal: "6px 6px 0px #000",
        brutalLg: "10px 10px 0px #000",
      },
      borderWidth: {
        brutal: "3px",
        heavy: "4px",
      },
    },
  },
  plugins: [],
};