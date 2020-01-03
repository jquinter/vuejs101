require('@babel/polyfill')
const isProd = process.env.NODE_ENV === 'production'
const plugins = []
plugins.push(['@babel/plugin-proposal-object-rest-spread', { 'loose': true, 'useBuiltIns': true }])
plugins.push('@babel/plugin-transform-regenerator')
module.exports = {
  presets: [
    // '@vue/cli-plugin-babel/preset',
    [ '@vue/app', { 'useBuiltIns': 'entry' } ]
  ],
  plugins: plugins
}
