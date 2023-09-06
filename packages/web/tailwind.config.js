/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      "xs": "414px",
    },
    extend: {
      colors: {
        "uaena": "#E4E724",
      },
    }
  },
  plugins: [],
}
