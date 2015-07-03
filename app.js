var Promise = require('bluebird');

var log = require('./lib/log')();

var config = require('./lib/config');
log.debug('config: %j', config, {});

var Section = require('./lib/models/section');
var Program = require('./lib/models/program');

var testData = require('./lib/test-data.json');

var sections = testData.sections.map(function (section) {
  return new Section(section);
});
Program.sections = sections;
log.debug('sections: %j', sections, {});

log.info('Initializing sections');
Promise.each(sections, function (section) {
    return section.initialize();
  })
  .then(function () {
    log.info('Finished initializing sections');

    var programs = testData.programs.map(function (program) {
      return new Program(program);
    });
    log.debug('programs: %j', programs, {});

    programs.forEach(function (program) {
      program.schedule();
      if (program.name === 'Test') {
        program.execute();
      }
    });
  });

process.on('SIGINT', function () {
  log.info('Cleaning up');
  return Promise.each(sections, function (section) {
    section.deinitialize();
  })
    .then(function () {
      log.info('Finished cleaning up. Exiting...');
      process.exit(2);
    });
});