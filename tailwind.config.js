const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*{html,js,jsx}'],
  darkMode: false, // or 'media' or 'class'
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      ...colors,
      bgPink: {
        200: '#eed2d1',
        300: '#e1b5b6',
        400: '#dd9fa0',
        500: '#d79191',
        600: '#db807f',
        800: '#8a4e4e',
      },
      bgBrown: {
        200: '#e0baa5',
        600: '#bc8c77',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
