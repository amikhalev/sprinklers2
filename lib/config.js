var _ = require('lodash');
var path = require('path');

var defaults = require('./config/default');

require('dotenv').load();
var env = process.env.NODE_ENV || 'development';

module.exports = _.assign(defaults, require(path.join(__dirname, 'config', env)));
