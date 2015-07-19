import Promise from 'bluebird';
import later from 'later';
import _ from 'lodash';

let baseLog = require('../log')('program');
import Section from './section.js';
import sse from '../routes/sse.js';

later.date.localTime();

let props = ['enabled', 'name', 'when', 'times'];

export default class Program {
  constructor(data) {
    _.assign(this, _.pick(data, props));
    this.running = false;
    this.clear = null;
    this.log = baseLog.child({
      program: this.name
    });
    this.schedule();
  }

  static list() {
    return Promise.resolve(Program.programs);
  }

  static update() {
    sse.send(Program.programs.map(program => program.data()), 'programs');
  }

  data() {
    return _.pick(this, props.concat(['running']));
  }

  execute() {
    this.log.info('Executing program');
    this.running = true;
    Program.update();
    return Section.list()
      .each((section, index) => section.runFor(this.times[index]))
      .then(() => {
        this.log.info('Finished executing');
        this.running = false;
        Program.update();
      });
  }

  schedule() {
    if (this.clear !== null) {
      this.log.info('Already scheduled, descheduling');
      this.deschedule();
    }
    if (!this.enabled) {
      this.log.info('Program is disabled');
      return;
    }
    let sched = later.parse.text(this.when);
    if (sched.error !== -1) {
      this.log.error('Invalid schedule: ');
      this.log.error(this.when);
      this.log.error(new Array(sched.error + 1).join('-') + '^');
      return;
    }
    this.clear = later.setInterval(() =>
        this.execute()
          .then(() => {
            let next = later.schedule(sched).next(1).toString();
            this.log.info({next}, 'Finished running');
          })
      , sched).clear;
    let next = later.schedule(sched).next(1).toString();
    this.log.info({when: this.when, next}, 'Program scheduled');
  }

  deschedule() {
    if (this.clear != null) {
      this.log.info('Descheduling program');
      this.clear();
      this.clear = null;
    }
  }
}

Program.programs = require('../test-data.json').programs.map(program =>
    new Program(program)
);
