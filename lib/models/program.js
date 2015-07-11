import Promise from 'bluebird';
import later from 'later';
import _ from 'lodash';

let baseLog = require('../log')('program');

later.date.localTime();

import Section from './section.js';

let props = ['enabled', 'name', 'when', 'times'];

export default class Program {
  constructor(data) {
    _.assign(this, _.pick(data, props));
    this.clear = null;
    this.log = baseLog.child({
      program: this.name
    });
  }

  static list() {
    return Promise.map(require('../test-data.json').programs, program =>
        new Program(program)
    );
  }

  data() {
    return _.pick(this, props);
  }

  execute() {
    this.log.info('Executing program');
    return Section.list()
      .then(sections =>
        Promise.each(this.times, (time, index) =>
            sections[index].runFor(time)
        )
    ).then(() =>
        this.log.info('Finished executing')
    );
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
