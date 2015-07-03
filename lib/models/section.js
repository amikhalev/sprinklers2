var Promise = require('bluebird');
var _ = require('lodash');
var config = require('./../config');

var log = require('./../log')();

var gpio;
if (config.gpioStub) {
  log.info('Using gpioStub');
  gpio = require('./../gpioStub');
} else {
  log.info('Using pi-gpio');
  gpio = require('pi-gpio');
}
gpio = Promise.promisifyAll(gpio);

var Section = function (config) {
  _.assign(this, config);
};

Section.prototype.save = function () {
  return this;
};

Section.prototype.initialize = function () {
  log.debug('Opening pin %s as output', this.pin);
  return gpio.openAsync(this.pin, "output")
    .bind(this)
    .catch(function () {
      log.warn('Pin %s was already open!', this.pin);
    })
    .then(function () {
      log.debug('Writing 0 to pin %s', this.pin);
      return gpio.writeAsync(this.pin, 0);
    });
};

Section.prototype.deinitialize = function () {
  log.debug('Closing pin %s', this.pin);
  return gpio.closeAsync(this.pin);
};

Section.prototype.runFor = function (seconds) {
  log.info('Running section "%s" for %s seconds', this.name, seconds);
  return Promise.resolve()
    .bind(this)
    .then(function () {
      return gpio.writeAsync(this.pin, 1);
    })
    .delay(seconds * 1000)
    .then(function () {
      return gpio.writeAsync(this.pin, 0);
    })
    .then(function () {
      log.info('Finished running section "%s"', this.name);
    })
    .catch(function (err) {
      log.error('Error while running section: ', err);
    });
};

module.exports = Section;
