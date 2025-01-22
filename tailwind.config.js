// tailwind.config.js

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "Inter-Black": ["Inter-Black", "sans-serif"],
        "Inter-bold": ["Inter-Bold", "sans-serif"],
        "Inter-extrabold": ["Inter-ExtraBold", "sans-serif"],
        "Inter-medium": ["Inter-Medium", "sans-serif"],
      },
      colors: {
        Primary: "#6687c4",
        brand: "#0076FC",
        Black: "#434343",
        red: "#E13434",
        grey: "#909198",
        textColor1: "#393A44",
        textColor2: "#909198",
        textField: "#F8F8F8",
        tint: "#CBE3FF",
      },
    },
  },
  plugins: [],
};
