import Promise from 'bluebird';

const log = require('./lib/log')();

import config from './lib/config';
log.debug({config}, 'config');

import {Section, Program} from './lib/models';

Promise.all([Section.list(), Program.list()])
  .spread((sections, programs) => {
    log.debug({sections}, 'sections');
    log.debug({programs}, 'programs');
    log.info('Initializing sections');
    return Promise.each(sections, section => section.initialize())
      .then(() => {
        log.info('Finished initializing sections');

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

import express from 'express';
import bodyParser from 'body-parser';
import expressBunyan from 'express-bunyan-logger';
//import auth from './lib/auth';
import {HttpError, validationErrorHandler, syntaxErrorHandler} from './lib/errors';
import {join} from 'path';

const app = express();

app.use(expressBunyan(config.server.logger));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(join(__dirname, 'public')));

//app.use('/', auth());
//app.use('/api', auth());

app.use('/api/sections', require('./lib/routes/sections'));
app.use('/api/programs', require('./lib/routes/programs'));
app.use('/api/sse', require('./lib/routes/sse').route);

app.use(validationErrorHandler);
app.use(syntaxErrorHandler);
app.use(HttpError.handler);

var PORT = process.env.PORT || config.server.port;
var server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;
  log.info({address: server.address()}, `Sprinklers server listening at http://${host}:${port}`);
});

export default app;
