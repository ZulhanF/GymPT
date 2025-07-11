const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/js/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp|avif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './src/workout.html',
      filename: 'workout.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './src/nutrisi.html',
      filename: 'nutrisi.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './src/alatgym.html',
      filename: 'alatgym.html',
      chunks: ['main']
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/gambar',
          to: 'gambar'
        },
        {
          from: 'netlify',
          to: 'netlify'
        }
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    hot: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  }
}; 