var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: ['./src/'],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'resources/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'electron-package.json',
        to: 'package.json'
      },
      {
        from: 'index.html',
        to: '.'
      },
      {
        from: 'electron.js',
        to: 'main.js'
      },
      {
        from: 'resources/',
        to: 'resources/'
      }
    ])
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    contentBase: './dist',
    stats: 'errors-only',
    noInfo: true,
    inline: true,
    host: 'localhost',
    compress: true,
    port: 3000
  }
}
