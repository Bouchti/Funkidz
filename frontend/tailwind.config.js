/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f1f7fc',
          100: '#e1eef8',
          200: '#bcdcf0',
          300: '#81bee3',
          400: '#3e9bd3',
          500: '#185FA5',
          600: '#114a87',
          700: '#0f3c6e',
          800: '#11345c',
          900: '#132d4e',
          950: '#0d1d33',
        },
        secondary: {
          50: '#f1f9f7',
          100: '#dcefed',
          200: '#b9dfdb',
          300: '#89c6bf',
          400: '#5ca69d',
          500: '#0F6E56',
          600: '#316e68',
          700: '#2b5a56',
          800: '#264947',
          900: '#223e3c',
          950: '#122424',
        },
        accent: {
          50: '#fdf8ed',
          100: '#f9eeda',
          200: '#f2d9b1',
          300: '#e8bc7c',
          400: '#dd984d',
          500: '#854F0B',
          600: '#b8661f',
          700: '#994f1c',
          800: '#7a401d',
          900: '#64361c',
          950: '#361a0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
