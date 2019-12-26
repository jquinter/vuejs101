const plugins = []
plugins.push(['@babel/plugin-proposal-object-rest-spread', { 'loose': true, 'useBuiltIns': true }])
plugins.push("transform-remove-console")
plugins.push("@babel/plugin-transform-regenerator")
// if(process.env.NODE_ENV === 'production') {
//   plugins.push("transform-remove-console")
// }
module.exports = {
  presets: [
    // '@vue/cli-plugin-babel/preset',
    [ "@vue/app", { "useBuiltIns": "entry" } ]
  ],
  plugins: plugins
}
