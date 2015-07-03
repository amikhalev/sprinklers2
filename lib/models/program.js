var Promise = require('bluebird');
var _ = require('lodash');
var later = require('later');
var log = require('./../log')();

later.date.localTime();

var Program = function (config) {
  _.assign(this, config);
  this.clear = null;
};

Program.list = function () {
  return require('../test-data.json').programs.map(function (program) {
    return new Program(program);
  });
};

Program.prototype.save = function () {
  return _.omit(this, 'clear');
};

Program.prototype.execute = function () {
  log.info('Executing program "%s"', this.name);
  return Promise.each(this.times, function (time, index) {
    return Program.sections[index].runFor(time);
  })
    .bind(this)
    .then(function () {
      log.info('Finished executing program "%s"', this.name);
    });
};

Program.prototype.schedule = function () {
  if (this.clear !== null) {
    log.info('Program "%s" has already been scheduled, descheduling', this.name);
    this.clear();
    this.clear = null;
  }
  if (this.enabled) {
    var sched = later.parse.text(this.when);
    if (sched.error != -1) {
      log.error('Invalid schedule for program "%s":', this.name);
      log.error('%s', this.when);
      log.error('%s', new Array(sched.error + 1).join("-") + "^");
      return;
    }
    var self = this;
    this.clear = later.setInterval(function () {
      self.execute()
        .then(function () {
          var next = later.schedule(sched).next(1).toString();
          log.info('Next execution time: "%s"', next);
        });
    }, sched).clear;
    var next = later.schedule(sched).next(1).toString();
    log.info('Program "%s" is scheduled for "%s" and will next execute at "%s"', this.name, this.when, next);
  } else {
    log.info('Program "%s" is disabled', this.name)
  }
};

module.exports = Program;
