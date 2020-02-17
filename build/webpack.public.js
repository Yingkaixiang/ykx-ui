const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { resolve } = require('./util');

const TARGET = process.env.npm_lifecycle_event;

module.exports = {
  resolve: {
    alias: {
      '@': resolve('../components'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { appendTsSuffixTo: [/\.vue$/] },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader:
              TARGET.indexOf('storybook') !== -1
                ? 'vue-style-loader'
                : MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            },
          },
          {
            loader: 'css-loader',
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              prependData: `$color: green;`,
            },
          },
        ],
      },
    ],
  },
};
