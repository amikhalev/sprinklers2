var _ = require("lodash");
var defaults = {
  server: {},
  winston: {
    console: {
      colorize: 'all',
      timestamp: true
    }
  }
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
    winston: {
      console: {
        level: 'debug'
      }
    },
    gpioStub: true,
    datastore: {
      inMemoryOnly: true
    },
    testData: true
  }
};

var env = process.env.ENV || 'development';

module.exports = _.defaultsDeep(envs[env], defaults);
