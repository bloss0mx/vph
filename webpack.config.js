const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './index.js',
  // mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },
  devServer: {
    contentBase: './dist'
  },
  resolve: {
    extensions: ['.ts', '.js', '.css', '.less']
  },
  module: {
    rules: [
      {
        test: /\.html$/, use: 'html-loader'
      },
      {
        test: /\.ts$/, use: 'ts-loader'
      },
      {
        test: /\.(js|jsx)$/, use: 'babel-loader'
      },
      {
        test: /\.less$/, use: 'less-loader'
      },
      {
        test: /\.css$/, use: ['style-loader', 'css-loader'],
        // exclude: path.resolve(__dirname, './style.css'),
      }
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({ template: './index.html' })
  ]
};