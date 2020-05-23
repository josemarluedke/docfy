const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      inset: {
        '16': '4rem'
      },
      maxWidth: {
        'screen-2xl': '1400px'
      },
      maxHeight: {
        '(screen-16)': 'calc(100vh - 4rem)'
      },
      colors: {
        gray: {
          ...defaultTheme.colors.gray,
          1000: '#12161f'
        }
      }
    }
  },
  variants: {
    backgroundColor: [
      'responsive',
      'hover',
      'focus',
      'dark',
      'dark-hover',
      'dark-focus'
    ],
    borderColor: [
      'responsive',
      'hover',
      'focus',
      'dark',
      'dark-hover',
      'dark-focus'
    ],
    textColor: [
      'responsive',
      'hover',
      'focus',
      'dark',
      'dark-hover',
      'dark-focus'
    ],
    divideColor: ['responsive', 'dark'],
    boxShadow: ['responsive', 'hover', 'focus', 'focus-within', 'focus-visible']
  },
  plugins: [
    require('tailwindcss-dark-mode')(),

    plugin(function ({ addVariant, e }) {
      addVariant('focus-visible', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(
            `focus-visible${separator}${className}`
          )}[data-focus-visible-added]`;
        });
      });
    })
  ]
};
