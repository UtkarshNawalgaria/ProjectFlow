/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        outline: "#e7e7e7",
        primary: "#6366f1",
        error: "#dc2626",
        "grey-lightest": "#f8fafc",
        "grey-dark": "#374151",
      },
    },
  },
  daisyui: {
    themes: [],
  },
  plugins: [require("@tailwindcss/forms")],
};
