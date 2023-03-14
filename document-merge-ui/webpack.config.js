/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.join(__dirname),
  devtool: 'inline-source-map',
  entry: {
    app: './src/index.tsx'
  },
  output: {
    filename: './resources/js/bundle.js'
  },
  resolve: {
    extensions: ['.js', 'jsx', '.ts', '.tsx', '.json', 'css', '.sass', '.scss', '.jpg', '.jpeg', '.png', '.svg'],
    mainFields: ['module', 'browser', 'main'],
    alias: {
      '@resources': path.resolve(__dirname, './resources'),
      '@constant': path.resolve(__dirname, './src/constant'),
      '@config': path.resolve(__dirname, './src/config'),
      '@component': path.resolve(__dirname, './src/component'),
      '@data': path.resolve(__dirname, './src/data'),
      '@service': path.resolve(__dirname, './src/service'),
      '@test': path.resolve(__dirname, './test'),
      '@scope': path.resolve(__dirname, './src/scope'),
      '@reducer': path.resolve(__dirname, './src/reducers'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@theme': path.resolve(__dirname, './src/theme'),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        },
        exclude: /node_modules/
      }, {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ]
      }, {
        test: /\.(jpe?g|gif|bmp|svg|mp3|mp4|ogg|wav)$/,
        use: [
          "file-loader"
        ]
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      DEBUG: false
    }),
    new MiniCssExtractPlugin({
      filename: '[hash].css'
    }),
    // TODO check loading step
    /* new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: '../../bundle-report.html'
    }), */
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: "./favicon.png",
      minify: {
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true
      }
    }),
    // new CopyWebpackPlugin([{
    //   from: './resources/js/',
    //   to: './',
    // }])
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, './src'),
    },
    port: 9000,
    client: {
      progress: true,
    },
    devMiddleware: {
      writeToDisk: true
    }
  }
};
/* eslint-enable */
