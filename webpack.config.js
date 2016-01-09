var webpack = require('webpack');
var path = require('path');

module.exports = {
  progress: true,
  stats: { colors: true, progress: true },
  debug: true,
  webpackDevMiddleware: {
    noInfo: true,
    publicPath: '/assets/',
    stats: { colors: true, progress: true }
  },
  cache: true,
  entry: [
    './app/scripts'
  ],
  module: {
    preLoaders: [],
    loaders: [
      { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loaders: [ 'babel' ] },
      { test: /\.less$/, loaders: [ 'style', 'css', 'less' ] },
      { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
    ]
  },
  resolve: {
    alias: {
      'scripts': path.join(__dirname, 'app', 'scripts'),
      'styles': path.join(__dirname, 'app', 'styles')
    }
  },
  plugins: []
};