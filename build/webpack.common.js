// 全量导出
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { resolve } = require('./util');

const webpackBaseConfig = require('./webpack.base');
const packageJSON = require('../package.json');

module.exports = merge(webpackBaseConfig, {
  entry: resolve('../src/index.js'),
  output: {
    path: resolve('../cjs'),
    filename: `${packageJSON.name}.js`,
    libraryExport: 'default',
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${packageJSON.name}.css`,
    }),
  ],
});
