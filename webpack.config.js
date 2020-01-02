const isProd = process.env.NODE_ENV === "production"
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const TerserPlugin = require('terser-webpack-plugin')
require("@babel/polyfill");

module.exports = {
  entry: ["@babel/polyfill", "./app/js"],
  // entry: './src/main.js',
  output: {
    path: require('path').resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'app.js'
  },
  resolve: {
    alias: {
      '@': require('path').resolve(__dirname, 'src')
    }
  },
  plugins: [new VueLoaderPlugin()
    , new VuetifyLoaderPlugin()
    , new TerserPlugin()
    , new JavaScriptObfuscator({
      identifierNamesGenerator: 'mangled'
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {}
          // other vue-loader options go here
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              fiber: require('fibers'),
              indentedSyntax: true // optional
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: isProd,
    minimizer: isProd ? [
      new TerserPlugin({
        TerserOptions: {
          compress: {
            drop_console: isProd
          },
          ecma: undefined,
          warnings: false,
          parse: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: true,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false
        }
      })
    ] : []
  }
}
