/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ Ensure Dark Mode is enabled
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"], // ✅ Make sure Tailwind scans files
  theme: {
    extend: {
      colors: {
        primary: "#6D5DFB", // Sidebar Background
        secondary: "#E3DFFF", // Light Background
        cardBg: "#F8F8FF", // Card Background
        gradientStart: "#F3D9FA", // Soft Pink
        gradientEnd: "#B2DFFC", // Soft Blue
      },
    },
  },
  plugins: [],
};
