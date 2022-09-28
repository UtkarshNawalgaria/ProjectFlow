/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        outline: "#e7e7e7",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
