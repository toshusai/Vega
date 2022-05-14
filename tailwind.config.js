const { light, dark } = require('@charcoal-ui/theme')
const { createTailwindConfig, config } = require('@charcoal-ui/tailwind-config')

module.exports = {
  content: ['~/**/*.vue'],
  presets: [
    createTailwindConfig({
      version: 'v3',
      theme: {
        ':root': dark,
      },
    }),
  ],
}
