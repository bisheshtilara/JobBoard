const webpack = require('webpack')
const sass2less = require('less-plugin-sass2less')
const StyleLintPlugin = require('stylelint-webpack-plugin')

module.exports = {
  lintOnSave: true,
  css: {
    loaderOptions: {
      less: {
        plugins: [sass2less]
      }
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'nl',
      fallbackLocale: 'en',
      localeDir: 'languages',
      enableInSFC: true
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(en)$/),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new StyleLintPlugin({
        files: ['src/**/*.{vue,htm,html,css,sss,less,scss,sass}']
      })
    ]
  },
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.prettify = false
        return options
      })
  }
}
