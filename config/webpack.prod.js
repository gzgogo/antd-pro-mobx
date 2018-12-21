const path = require("path");
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const autoprefixer = require('autoprefixer');
const common = require('./webpack.common');
const PATHS = require("./PATHS");

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[chunkhash:8].js',
    path: path.resolve(PATHS.dist),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: "css-loader" }
          ]
        })
      },
      {
        test: /\.less$/,
        exclude: path.resolve(PATHS.src, 'asset/stylesheet'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: "css-loader",
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: "[local]_[hash:base64:5]",
                sourceMap: true,
                minimize: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [autoprefixer('last 2 version')],
                sourceMap: true
              }
            },
            {
              loader: "less-loader",
              options: {
                javascriptEnabled: true
              }
            }
          ]
        })
      },
      {
        test: /\.less$/,
        include: path.resolve(PATHS.src, 'asset/stylesheet'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: "css-loader" },
            { 
              loader: "less-loader",
              options: {
                javascriptEnabled: true
              }
            }
          ]
        })
      },
    ]
  },
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial',
          name: 'vendor'
        }
      }
    }
  },
  performance: {
    hints: false
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      allChunks: true,
    }),
    // 注意一定要在HtmlWebpackPlugin之后引用
    // inline的name和runtimeChunk的name保持一致
    new ScriptExtHtmlWebpackPlugin({
      inline: /runtime\..*\.js$/
    })
  ]
});
