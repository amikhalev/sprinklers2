import Promise from 'bluebird';
import DataTypes from 'sequelize/lib/data-types';
import Instance from 'sequelize/lib/instance'
import sequelize from './sequelize';

import createLogger from '../util/createLogger';
let baseLog = createLogger('Program');
import {parseSchedule} from '../util/schedule';
import executor from '../executor';

import sse from '../routes/sse.js';

class Program extends Instance {
  constructor(values, options) {
    super(values, options);
    this.log = baseLog.child({
      program: this.name
    });
  }

  static pushAllSse() {
    return ProgramModel.findAll()
      .map(program => program.data())
      .then(programs => sse.send(programs, 'programs'));
  }

  pushSse() {
    return this.data()
      .then(data => sse.send([ programs ], 'programs'));
  }

  data() {
    let data = this.get();
    return Promise.resolve(data);
  }

  ensureScheduled() {
    if (this.enabled) {
      this.log.trace('Program enabled after update/startup, (re)scheduling');
      executor.scheduleProgram(this);
    } else {
      this.log.trace('Program disabled after update/startup, descheduling');
      executor.descheduleProgram(this.id);
    }
  }
}

const ProgramModel = sequelize.define('Program', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scheduleString: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isValidSchedule: function () { return parseSchedule(this.scheduleString); }
    }
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  classMethods: {
    associate: (models) => {
      let {Program, ProgramSection, Section} = models;
      Program.addScope('defaultScope', {
        include: [ {
          model: ProgramSection,
          as: 'times',
          include: [ {
            model: Section,
            as: 'section'
          } ]
        } ]
      }, { override: true });
    }
  },
  hooks: {
    afterUpdate (program) {
      program.ensureScheduled();
    }
  }
});

Program.prototype.$Model = Program.prototype.Model = ProgramModel;
ProgramModel.Instance = Program;
ProgramModel.refreshAttributes();

export default ProgramModel;