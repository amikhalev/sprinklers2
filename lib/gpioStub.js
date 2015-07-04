var log = require('./log')('gpioStub');

module.exports.open = function (pin, direction, callback) {
  log.debug("open(%s, %s)", pin, direction);
  process.nextTick(callback);
};

module.exports.write = function (pin, value, callback) {
  log.debug("write(%s, %s)", pin, value);
  process.nextTick(callback);
};

module.exports.read = function (pin, callback) {
  log.debug("read(%s)", pin);
  process.nextTick(function () {
    callback(null, false);
  });
};

module.exports.close = function (pin, callback) {
  log.debug("close(%s)", pin);
  process.nextTick(callback);
};
