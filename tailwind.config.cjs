/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.{html,js}", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "bg-color": "#ed1c24",
        primary: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554" }
      },
      screens: {
        'xs': '390px',
      },
      spacing: {
        '29': '7.5rem',
        '18': '4.60rem',
      },
      fontSize: {
        'xxs': '0.813rem'
      }
    },
  },
  plugins: [],
}


