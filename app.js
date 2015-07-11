import Promise from 'bluebird';
import express from 'express';
import path from 'path';

const log = require('./lib/log')();

import config from './lib/config';
log.debug({config}, 'config');

import Section from './lib/models/section';
import Program from './lib/models/program';

Promise.all([Section.list(), Program.list()])
  .spread((sections, programs) => {
    log.debug({sections}, 'sections');
    log.debug({programs}, 'programs');
    log.info('Initializing sections');
    return Promise.each(sections, section => section.initialize())
      .then(() => {
        log.info('Finished initializing sections');

        programs.forEach(program => {
          program.schedule();
          if (program.name === 'Test' && config.runTest) {
            program.execute();
          }
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
          log.info({code}, 'Exiting...');
        });
      });
  });

let app = express();

import bodyParser from 'body-parser';
import expressBunyan from 'express-bunyan-logger';
import auth from './lib/auth';

app.use(bodyParser.json({extended: true}));
app.use(expressBunyan(config.server.logger));
app.use(auth());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/sections', require('./lib/routes/sections'));
app.use('/programs', require('./lib/routes/programs'));

var PORT = process.env.PORT || config.server.port;
var server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;
  log.info({address: server.address()}, `Sprinklers server listening at http://${host}:${port}`);
});

export default app;
