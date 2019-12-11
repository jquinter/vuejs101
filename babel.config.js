module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ["@babel/plugin-proposal-object-rest-spread", { "loose": true, "useBuiltIns": true }]
  ]
}
