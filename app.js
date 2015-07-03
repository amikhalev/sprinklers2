var Promise = require('bluebird');
var express = require('express');

var log = require('./lib/log')();

var config = require('./lib/config');
log.debug('config: %j', config, {});

var Section = require('./lib/models/section');
var Program = require('./lib/models/program');

var sections = Section.list();
log.debug('sections: %j', sections, {});
Program.sections = sections;

var programs = Program.list();
log.debug('programs: %j', programs, {});

log.info('Initializing sections');
Promise.each(sections, function (section) {
  return section.initialize();
})
  .then(function () {
    log.info('Finished initializing sections');

    programs.forEach(function (program) {
      program.schedule();
      if (program.name === 'Test' && config.runTest) {
        program.execute();
      }
    });
  });

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-winston').logger(config.server.logger));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index', {sections: sections, programs: programs});
});

app.post('/runFor', function (req, res) {
  var section = sections[req.body.section];
  var time = parseInt(req.body.time, 10);
  section.runFor(time);
  res.redirect('/');
});

app.post('/runProgram', function (req, res) {
  var program = programs[req.body.program];
  program.execute();
  res.redirect('/');
});

var PORT = process.env.PORT || config.server.port;
var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  log.info('Sprinklers server listening at http://%s:%s', host, port);
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