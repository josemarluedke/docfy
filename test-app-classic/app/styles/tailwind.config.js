module.exports = {
  content: [
    '../app/**/*.{html,js,ts,hbs,gts,gjs}',
    '../docs/**/*.{md,markdown}',
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
};
