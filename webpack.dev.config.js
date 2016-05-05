var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var config = _.clone(require('./webpack.config'), true);

config.entry.unshift('react-hot-loader/patch');
config.entry.unshift('webpack/hot/only-dev-server');
config.entry.unshift('webpack-hot-middleware/client');
config.devtool = 'source-map';
config.output = {
  path: path.join(__dirname, 'public', 'assets'),
  publicPath: 'assets/',
  filename: 'bundle.js'
};
config.module.preLoaders.push({ test: /\.jsx?$/, exclude: /node_modules/, loader: 'eslint-loader' });
config.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: '"development"'
  }
}));
config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.eslint = {
  formatter: require('eslint-friendly-formatter')
};

module.exports = config;