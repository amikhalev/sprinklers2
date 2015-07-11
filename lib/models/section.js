import Promise from 'bluebird';
import _ from 'lodash';

let baseLog = require('../log')('section');

import config from '../config';
let gpio;
if (config.gpioStub) {
  baseLog.info('Using gpioStub');
  gpio = require('./../gpioStub');
} else {
  baseLog.info('Using pi-gpio');
  gpio = require('pi-gpio');
}
gpio = Promise.promisifyAll(gpio);

let props = ['name', 'pin'];

export default class Section {
  constructor(data) {
    _.assign(this, _.pick(data, props));
    this.log = baseLog.child({
      section: this.name
    });
  }

  static list() {
    return Promise.map(require('../test-data.json').sections, section=>
        new Section(section)
    );
  }

  data() {
    return _.pick(this, props);
  }

  initialize() {
    this.log.info({pin: this.pin}, 'Initializing section');
    return gpio.openAsync(this.pin, 'output')
      .catch(() =>
        this.log.warn({pin: this.pin}, 'Pin was already open!')
    )
      .then(() => this.setValue(0));
  }

  deinitialize() {
    this.log.info('Deinitializing section');
    return gpio.closeAsync(this.pin);
  }

  setValue(value) {
    this.log.debug({value}, 'Setting section value');
    return gpio.writeAsync(this.pin, value);
  }

  getValue() {
    return gpio.readAsync(this.pin);
  }

  runFor(seconds) {
    this.log.info({seconds}, 'Running section');
    return this.setValue(1)
      .delay(seconds * 1000)
      .then(() => this.setValue(0))
      .then(() => this.log.info('Finished running section'))
      .catch((err) => this.log.error(err, 'Error while running section'));
  }
}
