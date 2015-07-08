var Promise = require('bluebird');
var express = require('express');

var log = require('./lib/log')();

var config = require('./lib/config');
log.debug({config: config}, 'config');

var Section = require('./lib/models/section');
var Program = require('./lib/models/program');

var sections = Section.list();
log.debug({sections: sections}, 'sections');
Program.sections = sections;

var programs = Program.list();
log.debug({programs: programs}, 'programs');

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
var expressBunyan = require('express-bunyan-logger');
app.use(expressBunyan(config.server.logger));
app.use(expressBunyan.errorLogger(config.server.logger));
app.use(require('./lib/auth')());

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index', {sections: sections, programs: programs});
});

app.post('/runFor', function (req, res) {
  var section = sections[req.body.section];
  var time = parseFloat(req.body.time);
  if (!section) {
    return res.status(400).end("Invalid section number");
  }
  if (isNaN(time)) {
    return res.status(400).end("Invalid time");
  }
  section.runFor(time);
  res.status(200).end();
});

app.post('/runProgram', function (req, res) {
  var program = programs[req.body.program];
  program.execute();
  res.status(200).end();
});

app.get('/sections', function (req, res) {
  Promise.map(sections, function (section) {
    return section.getValue()
      .then(function (value) {
        section.value = value;
        return section;
      });
  }).then(function (sections) {
    res.send(sections);
  });
});

var PORT = process.env.PORT || config.server.port;
var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  log.info({address: server.address()}, 'Sprinklers server listening at http://%s:%s', host, port);
});

process.on('SIGINT', function () {
  log.info('Cleaning up');
  return Promise.each(sections, function (section, i) {
    section.deinitialize();
  })
    .then(function () {
      log.info('Finished cleaning up');
      process.exit(2);
    });
});

process.on('exit', function (code) {
  log.info({code: code}, 'Exiting...');
});