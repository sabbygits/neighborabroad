/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        london: {
          DEFAULT: '#2563EB',
          light: '#EFF6FF',
          dark: '#1D4ED8',
        },
        seoul: {
          DEFAULT: '#be1f3b',
          light: '#FFF1F3',
          dark: '#9B1631',
        },
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
        dm: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
