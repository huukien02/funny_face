/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      green: {
        400: "#1DB954",
        ...colors.green,
      },
      "custom-gray": "#32323280",
      "modal-gray": "#323232",
      ...colors,
    },
    fontFamily: {
      sans: ["Quicksan", "Lilita One", "ui-sans-serif", "system-ui"],
    },
    extend: {
      colors: {
        "custom-pink": "#FF9F9F",
        "custom-red": "#FF2C61",
        brightBackground: "#FDF8EE",
        brightGreen: "#539165",
        lightText: "#959595",
        yellow: {
          500: "#FBBF24",
        },
      },
    },
  },
  plugins: [],
};
