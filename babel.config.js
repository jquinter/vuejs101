const removeConsolePlugin = []
if(process.env.NODE_ENV === 'production') {
  removeConsolePlugin.push("transform-remove-console")
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['@babel/plugin-proposal-object-rest-spread', { 'loose': true, 'useBuiltIns': true }],
    removeConsolePlugin
  ]
}
