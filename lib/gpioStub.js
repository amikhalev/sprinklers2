var log = require('./log')('gpioStub');

var pins = [];

for (var i = 0; i <= 40; i++) {
  pins[i] = {
    direction: 'in',
    value: 0
  };
}

module.exports.open = function (pin, direction, callback) {
  log.debug({method: 'open', pin: pin, direction: direction}, "open");
  process.nextTick(callback);
};

module.exports.write = function (pin, value, callback) {
  log.debug({method: 'write', pin: pin, value: value}, "write");
  pins[pin].value = value;
  process.nextTick(callback);
};

module.exports.read = function (pin, callback) {
  log.debug({method: 'read', pin: pin}, "read");
  process.nextTick(function () {
    callback(null, pins[pin].value);
  });
};

module.exports.close = function (pin, callback) {
  log.debug({method: 'close', pin: pin}, "close");
  process.nextTick(callback);
};
