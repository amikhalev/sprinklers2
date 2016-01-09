import later from 'later';
import _ from 'lodash';
import Model from './Model';

import createLogger from '../createLogger';
let baseLog = createLogger('Program');

import Section from './Section.js';
import sse from '../routes/sse.js';

later.date.localTime();

export default class Program extends Model {
  static persistantProps = ['enabled', 'name', 'when', 'times'];

  constructor(data) {
    super(data);
    this.running = false;
    this.clear = null;
    this.log = baseLog.child({
      program: this.name
    });
    this.schedule();
  }

  static update() {
    return Program.list()
      .map(program => program.data())
      .then(programs => sse.send(programs, 'programs'));
  }

  data() {
    return _.pick(this, Program.persistantProps.concat(['running']));
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
        return Program.update();
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
