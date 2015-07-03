var winston = require('winston');
var _ = require('lodash');

var config = require('./config');

winston.loggers.options = config.winston;

module.exports = function (name) {
  name = name || '';
  return winston.loggers.get(name, _.defaultsDeep({
    console: {
      label: name
    }
  }, config.winston));
};
