/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      '2lg': '1152px',
      // => @media (min-width: 1152px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1408px',
      // => @media (min-width: 1408px) { ... }

      '3xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },

    colors: {
      'black': "#000000",
      'white': "#FFFFFF",
      'electricPurple': "#9748ff",
      'magenta': "#FA0184",
      'yellow': "#e6fc5c",
      'gray': {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
      }
    },

    extend: {},
  },
  plugins: [],
}
