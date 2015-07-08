var _ = require("lodash");

var PrettyStream = require('bunyan-prettystream');
var pretty = new PrettyStream();
pretty.pipe(process.stdout);

var defaults = {
  server: {
    port: 8080,
    logger: {
      name: 'http'
    }
  },
  bunyan: {
    name: 'app'
  },
  testData: true,
  runTest: false
};

var envs = {
  raspi: {
    bunyan: {
      level: 'info',
      streams: [{
        stream: process.stdout
      }, {
        type: 'rotating-file',
        level: 'debug',
        path: 'logs/app.log',
        period: '1d',
        count: 7 // keep 7 days of logs
      }]
    },
    gpioStub: true
  },
  development: {
    bunyan: {
      level: 'debug',
      streams: [{
        stream: pretty
      }]
    },
    gpioStub: true
  }
};

var env = process.env.NODE_ENV || 'development';

module.exports = _.defaultsDeep(envs[env], defaults);
