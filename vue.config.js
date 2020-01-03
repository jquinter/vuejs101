const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  chainWebpack (config) {
    config.plugins.delete('prefetch')
    config.plugin('CompressionPlugin').use(CompressionPlugin)
    config.optimization.minimize(true)
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true
      args[0].terserOptions.output = { comments: false, beautify: false }
      return args
    })
  },
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    }
  },
  transpileDependencies: [
    /(\/|\\)vuetify(\/|\\)/
  ]
}
