/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f9f1',
          100: '#e1f3e0',
          200: '#c3e7c0',
          300: '#96d491',
          400: '#62b95c',
          500: '#3c9d36',
          600: '#2c7f27',
          700: '#1b5e20', // Forest Green matching logo inner circle
          800: '#1a4e1e',
          900: '#0f3811',
          gold: '#e5a93c',
          cream: '#fffdf5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
