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
      ...colors
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
