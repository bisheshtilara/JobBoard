const IN_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
  plugins: [
    require('postcss-preset-env')({ stage: 0 }),
    require('tailwindcss')(),
    IN_PRODUCTION &&
      require('@fullhuman/postcss-purgecss')({
        content: [
          `./public/**/*.html`,
          `./src/**/*.vue`,
          /* https://github.com/tailwindcss/docs/issues/168 */
          './node_modules/sweetalert2/**/*.js',
          './node_modules/quill/**/*.js',
          './node_modules/vue-loading-overlay/**/*'
        ],
        defaultExtractor(content) {
          const contentWithoutStyleBlocks = content.replace(
            /<style[^]+?<\/style>/gi,
            ''
          )
          return (
            contentWithoutStyleBlocks.match(
              /[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g
            ) || []
          )
        },
        //Used in mixins/globalHelper.js, used as custom class for swal popup buttons
        whitelist: ['button-danger'],
        whitelistPatterns: [
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /^van-/,
          /^swal2-/,
          /^ql-/,
          /(^|\.)fa-/,
          /-fa($|\.)/,
          /^pace-/,
          /^pace/,
          /^vld-/,
          /^vld/
        ]
      }),
    require('autoprefixer')()
  ]
}
