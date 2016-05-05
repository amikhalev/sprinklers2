import Promise, {CancellationError} from 'bluebird';
import later from 'later';
import createLogger from './createLogger';
import {parseSchedule, startSchedule} from './schedule';
import {Section} from '../models/index';

export default class Executor {
  constructor() {
    this.log = createLogger('executor');
    this.sectionQueue = [];
    this.runningSection = null;
    this.scheduledPrograms = {};
  }

  scheduleSectionRun(section, time) {
    const queueItem = { section, time };
    this.log.trace({ queueItem }, 'Adding item to section queue');
    this.sectionQueue.unshift(queueItem);
    if (this.runningSection === null) {
      this.processSectionQueue();
    }
  }

  scheduleSectionRuns(sections) {
    this.log.trace({ sections }, 'Adding items to section queue');
    if (!Array.isArray(sections)) {
      throw new TypeError('sections must be an array of sections');
    }
    sections
      .forEach(({section, time}) =>
        this.scheduleSectionRun(section, time));
    this.log.trace({ sections: sections.length }, 'scheduled sections for running');
  }

  processSectionQueue() {
    const queueLength = this.sectionQueue.length;
    if (queueLength > 0) {
      const queueItem = this.sectionQueue.pop();
      this.log.trace({ queueItem }, 'Processing queue item');
      const {section, time} = queueItem;
      this.runSection(section, time)
        .then(() => (this.processSectionQueue(), null))
        .catch(err => this.log.error(err, 'Error while running section'));
    } else {
      this.log.debug('Finished processing queue');
    }
  }

  runSection(section, period) {
    if (!section || !section.Model) {
      throw new TypeError('section must be a valid Section');
    }
    if (typeof period !== 'number') {
      throw new TypeError('period must be a number');
    }
    let l = this.log.child({ section: section.name });
    if (this.runningSection !== null) {
      throw new Error('A section is already running! Did you mean to call scheduleSectionRun?');
    }
    // calculate approximate end time
    const currentTime = (new Date()).getTime();
    let endTime = new Date(currentTime + period * 1000); // add period in millis
    l.debug({ period, endTime }, 'Running section');
    let promise = section.setValue(1)
      .delay(period * 1000)
      .finally(() => {
        this.runningSection = null;
        return section.setValue(0);
      })
      .tap(() => l.debug('Finished running section'))
      .catch(CancellationError, () => l.debug('Section cancelled while running'));
    this.runningSection = { endTime, section, period, promise };
    return promise;
  }

  cancelCurrentSection() {
    this.runningSection.promise.cancel();
    this.runningSection = null;
    this.processSectionQueue();
    this.log.debug('Cancelled current section');
  }

  cancelAllSections() {
    this.sectionQueue = [];
    this.runningSection.promise.cancel();
    this.runningSection = null;
    this.log.debug('Cancelled all sections');
  }

  runProgram(program) {
    this.log.debug({ program: program.name }, 'Running program');
    let sections = program.times;
    this.scheduleSectionRuns(sections);
  }

  scheduleProgram(program) {
    let l = this.log.child({ program: program.name });
    if (this.scheduledPrograms[program.id]) {
      l.info('Program was already scheduled, descheduling then rescheduling');
      this.descheduleProgram(program.id);
    }
    let scheduleString = program.scheduleString;
    return parseSchedule(scheduleString)
      .catch(err => this.log.error(err, 'Error while parsing schedule string'))
      .then(schedule => {
        let getNextRun = (() => later.schedule(schedule).next(1).toString());
        let {stop} = startSchedule(schedule, () => {
          this.runProgram(program);
          l.debug({ next: getNextRun() }, 'Next run for program is');
        });
        this.scheduledPrograms[ program.id ] = {
          program, stop
        };
        l.info({ scheduleString, next: getNextRun() }, 'Scheduled program');
      });
  }

  descheduleProgram(id) {
    if (typeof id === 'object') {
      id = id.id;
    }
    const scheduledProgram = this.scheduledPrograms[ id ];
    if (!scheduledProgram) return;
    let {program, stop} = scheduledProgram;
    this.log.debug({ program: program.name }, 'Descheduling program');
    stop();
    delete this.scheduledPrograms[ id ];
  }
}