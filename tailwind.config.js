/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        doto: ['doto', 'sans-serif'],
        geist: ['geist', 'sans-serif']
      },
    },
  },
  plugins: [],
}