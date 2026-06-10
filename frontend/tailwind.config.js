/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4A90D9',
        secondary: '#7B68EE',
        accent: '#FF6B6B',
      },
    },
  },
  plugins: [],
  // RTL support via Tailwind's built-in logical properties (ms-, me-, ps-, pe-)
  dirMode: true,
}
