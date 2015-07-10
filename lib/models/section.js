var Promise = require('bluebird');
var _ = require('lodash');
var config = require('./../config');

var log = require('./../log')('section');

var gpio;
if (config.gpioStub) {
  log.info('Using gpioStub');
  gpio = require('./../gpioStub');
} else {
  log.info('Using pi-gpio');
  gpio = require('pi-gpio');
}
gpio = Promise.promisifyAll(gpio);

var Section = function (conf) {
  _.assign(this, conf);
};

Section.list = function () {
  return require('../test-data.json').sections.map(function (section) {
    return new Section(section);
  });
};

Section.prototype.save = function () {
  return this;
};

Section.prototype.initialize = function () {
  log.info({section: this.name}, 'initialize');
  return gpio.openAsync(this.pin, 'output')
    .bind(this)
    .catch(function () {
      log.warn('Pin %s was already open!', this.pin);
    })
    .then(function () {
      return this.setValue(0);
    });
};

Section.prototype.deinitialize = function () {
  log.info({section: this.name}, 'deinitialize');
  return gpio.closeAsync(this.pin);
};

Section.prototype.setValue = function (value) {
  log.debug({section: this.name, value: value}, 'set value');
  return gpio.writeAsync(this.pin, value);
};

Section.prototype.getValue = function () {
  return gpio.readAsync(this.pin);
};

Section.prototype.runFor = function (seconds) {
  log.info({section: this.name, seconds: seconds}, 'running section');
  return Promise.resolve()
    .bind(this)
    .then(function () {
      return this.setValue(1);
    })
    .delay(seconds * 1000)
    .then(function () {
      return this.setValue(0);
    })
    .then(function () {
      log.info({section: this.name}, 'finished running section');
    })
    .catch(function (err) {
      log.error(err, 'error while running section');
    });
};

module.exports = Section;
