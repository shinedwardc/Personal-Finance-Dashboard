/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        ubuntu: ['Ubuntu', 'sans-serif'],
      }
    },
  },
  purge: [
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.tsx',    
  ],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light","dark","forest","lemonade","aqua"]
  },
}

