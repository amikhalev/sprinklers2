var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var config = _.clone(require('./webpack.config'), true);

config.devtool = 'eval';
config.output = {
  path: path.join(__dirname, 'public', 'assets'),
  publicPath: 'assets/',
  filename: 'bundle.js'
};
config.module.preLoaders.push({ test: /\.jsx?$/, exclude: /node_modules/, loader: 'eslint-loader' });
config.module.loaders.push({ test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loaders: ['react-hot', 'babel'] });
config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.plugins.push(new webpack.DefinePlugin({
  __DEBUG__: true
}));
config.eslint = {
  formatter: require('eslint-friendly-formatter')
};

module.exports = config;