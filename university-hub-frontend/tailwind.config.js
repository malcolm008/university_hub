/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Use class strategy for dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom dark mode colors here
      },
    },
  },
  plugins: [],
}