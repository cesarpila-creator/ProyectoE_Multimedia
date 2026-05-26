/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      colors: {

        primary: "#1D4E89",
        primaryHover: "#2563EB",
        background: "#EEF3F8",
        darkText: "#0F172A",
        sidebar: "#1D4E89",
        card: "#FFFFFF",
        muted: "#64748B",

      },

    },
  },

  plugins: [],
}