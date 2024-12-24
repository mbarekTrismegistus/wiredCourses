/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  presets: [require('@spartan-ng/ui-core/hlm-tailwind-preset')],
  content: [
    "src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

