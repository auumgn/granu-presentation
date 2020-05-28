const path = require('path');
const BUILD = path.resolve(__dirname, 'dist');
const SRC = path.resolve(__dirname, 'src/js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: SRC + '/four.js',
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          },
          {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [{loader: MiniCssExtractPlugin.loader},{loader:'css-loader'}]
          },
          {
            test: /\.(jpg|png|jpeg|mp3)$/,
            exclude: /node_modules/,
            use: [
              {
                loader:'file-loader',
                options: {
                  output: 'fonts',
                }
              }
            ]
          }
        ]
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename:"bundle.css"
        })
      ],
      resolve: {
        extensions: ['*', '.js', '.jsx']
      },
    output: {
      path: BUILD,
      filename: 'bundle.js',
    },

  };