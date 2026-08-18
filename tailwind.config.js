/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0f2942",
        blueaccent: "#1c4b82",
        lightblue: "#eaf1f8",
        gold: "#c9a24b",
        ink: "#14212e",
        muted: "#5b6b78",
      },
      fontFamily: {
        display: ["Poppins", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

