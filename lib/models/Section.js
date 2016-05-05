import Promise from 'bluebird';
import DataTypes from 'sequelize/lib/data-types';
import Instance from 'sequelize/lib/instance'
import sequelize from './sequelize';

import createLogger from '../util/createLogger';
let baseLog = createLogger('Section');
import sse from '../routes/sse';
import executor from '../executor';

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

class Section extends Instance {
  constructor(values, options) {
    super(values, options);
    this.log = baseLog.child({
      section: this.name
    });
  }

  static pushSseAll() {
    return SectionModel.findAll()
      .map(section => section.data())
      .then(sections => sse.send(sections, 'sections'));
  }

  pushSse() {
    return this.data()
      .then(data => sse.send([ data ], 'sections'));
  }

  data() {
    return this.getValue()
      .then(value => {
        let section = this.get();
        section.value = value;
        if (executor.runningSection && executor.runningSection.section.id === section.id) {
          section.endTime = executor.runningSection.endTime;
        }
        return section;
      });
  }

  initialize() {
    this.log.debug({ pin: this.pin }, 'Initializing section');
    return gpio.openAsync(this.pin, 'output')
      .catch(err => this.log.warn({ pin: this.pin, err }, 'Pin was already open!'))
      .then(() => this.setValue(0))
      .catch(err => this.log.error(err, 'Error initializing section'));
  }

  deinitialize() {
    this.log.debug('Deinitializing section');
    return gpio.closeAsync(this.pin)
      .catch(err => this.log.error(err, 'Error deinitializing section'));
  }

  setValue(value) {
    this.log.debug({ value }, 'Setting section value');
    return gpio.writeAsync(this.pin, value)
      .then(() => this.pushSse());
  }

  getValue() {
    return gpio.readAsync(this.pin);
  }
}

const SectionModel = sequelize.define('Section', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pin: {
    type: DataTypes.INTEGER(11),
    allowNull: false
  }
}, {
  instanceMethods: {}
});

Section.prototype.$Model = Section.prototype.Model = SectionModel;
SectionModel.Instance = Section;
SectionModel.refreshAttributes();

export default SectionModel;

