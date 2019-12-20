const plugins = []
plugins.push(['@babel/plugin-proposal-object-rest-spread', { 'loose': true, 'useBuiltIns': true }])
if(process.env.NODE_ENV === 'production') {
  plugins.push("transform-remove-console")
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: plugins
}
