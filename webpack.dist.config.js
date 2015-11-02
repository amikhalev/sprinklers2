var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var config = _.clone(require('./webpack.config'), true);

config.output = {
  path: path.join(__dirname, 'dist', 'public', 'assets'),
  publicPath: 'assets/',
  filename: 'bundle.min.js'
};
config.module.loaders.push({ test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel' });
config.plugins.push(new webpack.optimize.UglifyJsPlugin({
  minimize: true
}));
config.plugins.push(new webpack.optimize.DedupePlugin());

module.exports = config;