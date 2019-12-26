// Add this line:
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  chainWebpack (config) {
    config.plugins.delete('prefetch')
    config.optimization.minimize(true)

    // and this line
    config.plugin('CompressionPlugin').use(CompressionPlugin)
  },
  configureWebpack: {
    devtool: 'source-map'
  },
  transpileDependencies: [
    /(\/|\\)vuetify(\/|\\)/
  ]
}
