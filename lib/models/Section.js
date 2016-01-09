import Promise from 'bluebird';
import _ from 'lodash';
import Model from './Model';

import createLogger from '../createLogger';
let baseLog = createLogger('section');
import sse from '../routes/sse';

import config from '../config';
let gpio;
if (config.gpioStub) {
  baseLog.info('Using gpioStub');
  gpio = require('./../util/gpioStub');
} else {
  baseLog.info('Using pi-gpio');
  gpio = require('pi-gpio');
}
gpio = Promise.promisifyAll(gpio);

export default class Section extends Model {
  static persistantProps = ['name', 'pin'];

  constructor(data) {
    super(data);
    this.endTime = null;
    this.log = baseLog.child({
      section: this.name
    });
  }

  static update() {
    return Promise.map(Section.list(), section => section.data())
      .then(sections => sse.send(sections, 'sections'));
  }

  data() {
    return this.getValue()
      .then(value => {
        let section = _.pick(this, Section.persistantProps.concat(['endTime']));
        section.value = value;
        return section;
      });
  }

  initialize() {
    this.log.debug({pin: this.pin}, 'Initializing section');
    return gpio.openAsync(this.pin, 'output')
      .catch(err => this.log.warn({pin: this.pin, err}, 'Pin was already open!'))
      .then(() => this.setValue(0))
      .catch(err => this.log.error({err}, 'Error initializing section'));
  }

  deinitialize() {
    this.log.debug('Deinitializing section');
    return gpio.closeAsync(this.pin)
      .catch(err => this.log.error({err}, 'Error deinitializing section'));
  }

  setValue(value) {
    this.log.debug({value}, 'Setting section value');
    return gpio.writeAsync(this.pin, value)
      .then(() => Section.update());
  }

  getValue() {
    return gpio.readAsync(this.pin);
  }

  runFor(seconds) {
    let endTime = new Date();
    endTime.setSeconds(endTime.getSeconds() + seconds);
    this.endTime = endTime;
    this.log.info({seconds, endTime}, 'Running section');
    return this.setValue(1)
      .delay(seconds * 1000)
      .then(() => this.setValue(0))
      .then(() => {
        this.log.info('Finished running section');
        this.endTime = null;
      })
      .catch(err => this.log.error({err}, 'Error while running section'));
  }
}
