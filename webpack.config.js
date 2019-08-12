var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: ['./src/'],
  output: {
    path: path.join(__dirname, '/docs'),
    filename: 'resources/bundle.js'
  },
  devtool: 'eval',
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
        from: 'index.html',
        to: '.'
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
    contentBase: './docs',
    stats: 'errors-only',
    noInfo: true,
    inline: true,
    host: 'localhost',
    compress: true,
    port: 3000
  }
}
