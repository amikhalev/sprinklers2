var _ = require("lodash");
var winston = require('winston');
var defaults = {
  server: {
    port: 8080,
    logger: {
      transports: [
        new winston.transports.Console({
          label: 'http',
          level: 'info',
          colorize: true,
          timestamp: true
        })
      ]
    }
  },
  winston: {
    console: {
      level: 'info',
      colorize: true,
      timestamp: true
    }
  },
  gpioStub: true,
  datastore: {
    inMemoryOnly: true
  },
  testData: true,
  runTest: false
};

var envs = {
  raspi: {
    winston: {
      console: {
        level: 'info'
      }
    },
    gpioStub: false,
    datastore: {
      filename: './sprinklers.db',
      autoload: true
    },
    testData: false
  },
  development: {
  }
};

var env = process.env.ENV || 'development';

module.exports = _.defaultsDeep(envs[env], defaults);
