require('@babel/polyfill')
const plugins = []
plugins.push(['@babel/plugin-proposal-object-rest-spread', { 'loose': true, 'useBuiltIns': true }])
plugins.push('@babel/plugin-transform-regenerator')
module.exports = {
  presets: [
    [ '@vue/cli-plugin-babel/preset', { 'useBuiltIns': 'entry' } ]
  ],
  plugins: plugins
}
