var webpack = require('webpack');
var path = require('path');

module.exports = {
  cache: true,
  stats: {
    color: true,
    reasons: true
  },
  entry: [
    './app/scripts'
  ],
  module: {
    preLoaders: [],
    loaders: [
      {test: /\.less$/, loaders: ['style', 'css', 'less']},
      {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
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