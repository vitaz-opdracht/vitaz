/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      './src/**/*.{html,ts,scss}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f4f6fc'
      }
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text)-+/,
    }
  ]
}
