// Custom plugin / function
const plugin = require('tailwindcss/plugin')

module.exports = {
  darkMode: 'class',
  future: {
    purgeLayersByDefault: true,
    applyComplexClasses: true,
  },
  purge: {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
      
    ],
    options: {
      safelist: {
        standard: ['outline-none'],
      },
    },
  },
  theme: {
    extend: {
      maxWidth: {
        '8xl': '1920px',
      },
      colors: {
        ctaStart: 'var(--color-bg-cta-start)',
        ctaStop: 'var(--color-bg-cta-stop)',
        green: {
          light: '--color-green-light',
          DEFAULT: '--color-green-dark',
          dark: '--color-green-dark',
        },
        logoBlue: '#145fb4',
      },
      backgroundColor: {
        primary: 'var(--color-bg-primary)',
        secondary: 'var(--color-bg-secondary)',
      },
      gradientColorStops: {
        ctaStop: 'var(--color-bg-cta-stop)',
      },
      textColor: {
        accent: 'var(--color-text-accent)',
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
      },
      textOpacity: {
        20: '0.2',
        80: '0.8',
      },
      spacing: {
        header: '80px',
      },
      height: {
        header: '80px',
      },
      margin: {
        30: '30px',
        50: '50px',
      },
    },
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      // Per aumentare i container scommentre qui
      // '2xl': '1536px',
      // // => @media (min-width: 1536px) { ... }

      // '8xl': '1920px',
    },
  },
  variants: {
    extend: {
      textColor: ['hover'],
      textOpacity: ['hover'],
      opacity: ['dark'],
    },
  },
  plugins: [
    plugin(function ({
      addUtilities,
      theme,
      // addComponents,
      // e,
      // prefix,
      // config,
      // variants,
    }) {
      // Add your custom styles here
      // console.log("backgroundColor", theme("backgroundColor"))
      const utilityPtHeaderHeight = {
        '.pt-h-header': {
          'padding-top': theme('height').header,
        },
      }
      addUtilities(utilityPtHeaderHeight, []) // ["hover", "focus"]
    }),
  ],
}
