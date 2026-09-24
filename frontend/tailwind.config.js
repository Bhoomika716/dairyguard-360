/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#07111F",
        darkCard: "#0F172A",
        darkHeader: "#0B1220",
        darkBorder: "#1E293B",
        brandPrimary: "#22C55E",
        energyYellow: "#F59E0B",
        hygieneBlue: "#38BDF8",
        wastePurple: "#A78BFA",
        criticalRed: "#EF4444",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
