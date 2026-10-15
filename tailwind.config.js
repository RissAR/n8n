/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#121518',
          900: '#1A1F24',
          800: '#232A31',
          700: '#2D343B',
          600: '#3E4750',
        },
        amber: {
          DEFAULT: '#D97706',
          dark: '#B45309',
          light: '#F59E0B',
          price: '#FBBF24',
        },
      },
    },
  },
  plugins: [],
}
