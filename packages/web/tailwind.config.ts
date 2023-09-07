import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "414px",
    },
    fontFamily: {
      hand: ["omyu_pretty"],
    },
    extend: {
      colors: {
        uaena: "#E4E724",
      },
      screens: {
        tall: { raw: "(min-height: 667px)" },
      },
    },
  },
  plugins: [],
};
export default config;
