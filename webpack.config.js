const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const PRODUCTION = process.env.NODE_ENV === 'production';

const extractCSS = new ExtractTextPlugin('[name].css');
const extractLESS = new ExtractTextPlugin('[name]_less.css');

module.exports = {
  entry: {
    index: './src/index.js',
    vph: './vph/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devServer: {
    contentBase: './dist'
  },
  resolve: {
    extensions: ['.ts', '.js', '.css', '.less'],
    alias: {
      'vph': path.resolve(__dirname, 'vph')
    }
  },
  module: {
    rules: [
      {
        test: /\.vph$/,
        use: [
          'babel-loader',
          path.resolve(__dirname, 'vph-loader'),
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              caseSensitive: true,
              removeAttributeQuotes: false,
            }
          },
        ],
      },
      {
        test: /\.(ts|tsx)$/, use: 'ts-loader'
      },
      {
        test: /\.(js|jsx)$/, use: 'babel-loader'
      },
      {
        test: /\.less$/,
        use: extractLESS.extract({ fallback: 'style-loader', use: ['css-loader?modules&localIdentName=[local]_[hash:base64:5]', 'less-loader'] }),
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({ fallback: 'style-loader', use: ['css-loader'] }),
      }
    ]
  },
  plugins: [
    // 通用插件
    new HtmlWebpackPlugin({ template: './index.html' }),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(zh-cn)$/),
    extractLESS,
    extractCSS,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vender.js',
      minChunks: function (module) {
        return module.context && module.context.includes('node_modules');
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      filename: 'manifest.js',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vph',
      chunks: ['vph', 'index']
    }),
    ...(() => {
      const plugins = [];
      if (PRODUCTION) {
        // 生产模式插件
        plugins.push(new UglifyJSPlugin());
        plugins.push(new webpack.SourceMapDevToolPlugin({}));
        plugins.push(new CleanWebpackPlugin(['dist']));
        plugins.push(new CompressionPlugin({
          test: /\.js(\?.*)?$/i
        }));
      } else {
        // 开发模式插件
        plugins.push(new BundleAnalyzerPlugin());
      }
      return plugins;
    })()
  ],
  devtool: PRODUCTION ? false : 'cheap-module-eval-source-map',
};