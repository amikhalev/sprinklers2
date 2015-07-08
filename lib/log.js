var bunyan = require('bunyan');
var _ = require('lodash');

var config = require('./config');

module.exports = function (name, conf) {
  conf = _.defaultsDeep(conf || {}, config.bunyan);
  conf.name = name || 'app';
  return bunyan.createLogger(conf);
};
