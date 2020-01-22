const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const TARGET = process.env.npm_lifecycle_event;

module.exports = {
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        {
          loader: TARGET === 'storybook'
              ? 'vue-style-loader'
              : MiniCssExtractPlugin.loader,
          options: {
            esModule: true,
          }
        },
        {
          loader: 'css-loader',
        },
        "postcss-loader",
        {
          loader: 'sass-loader',
          options: {
            prependData: `$color: green;`
          }
        }
      ],
    }],
  },
};