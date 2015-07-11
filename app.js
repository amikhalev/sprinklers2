import Promise from 'bluebird';
import express from 'express';
import path from 'path';

const log = require('./lib/log')();

import config from './lib/config';
log.debug({config}, 'config');

import Section from './lib/models/section';
import Program from './lib/models/program';

let sections = Section.list();
log.debug({sections}, 'sections');
Program.sections = sections;

let programs = Program.list();
log.debug({programs}, 'programs');

log.info('Initializing sections');
Promise.each(sections, section => section.initialize())
  .then(() => {
    log.info('Finished initializing sections');

    programs.forEach(program => {
      program.schedule();
      if (program.name === 'Test' && config.runTest) {
        program.execute();
      }
    });
  });

let app = express();

import bodyParser from 'body-parser';
import expressBunyan from 'express-bunyan-logger';
import auth from './lib/auth';

app.use(bodyParser.json({extended: true}));
app.use(expressBunyan(config.server.logger));
app.use(expressBunyan.errorLogger(config.server.logger));
app.use(auth());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/sections', (req, res) => {
  Promise.map(sections, section => section.getValue()
      .then(value => {
        let data = section.data();
        data.value = value;
        return data;
      })
  ).then(section => res.send(section));
});

app.post('/sections/:id/run', (req, res) => {
  let section = sections[req.params.id];
  const time = parseFloat(req.body.time);
  if (!section) {
    return res.status(400).end('Invalid section number');
  }
  if (isNaN(time)) {
    return res.status(400).end('Invalid time');
  }
  section.runFor(time);
  res.status(200).end();
});

app.get('/programs', (req, res) => {
  res.send(programs.map(program => program.data()));
});

app.post('/programs/:id/run', (req, res) => {
  let program = programs[req.params.id];
  program.execute();
  res.status(200).end();
});

var PORT = process.env.PORT || config.server.port;
var server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;
  log.info({address: server.address()}, `Sprinklers server listening at http://${host}:${port}`);
});

process.on('SIGINT', () => {
  log.info('Cleaning up');
  return Promise.each(sections, section => section.deinitialize())
    .then(() => {
      log.info('Finished cleaning up');
      /*eslint no-process-exit: 0*/
      process.exit(2);
    });
});

process.on('exit', (code) => {
  log.info({ code }, 'Exiting...');
});

export default app;
