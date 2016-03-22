import Promise from 'bluebird';

import createLogger from './createLogger';
const log = createLogger();

import config from './config';
log.debug({ config }, 'config');

import {Section, Program} from './models';

Promise.all([ Section.list(), Program.list() ])
  .spread((sections, programs) => {
    log.debug({ sections: sections.map(section => section.data()) }, 'sections');
    log.debug({ programs: programs.map(program => program.data()) }, 'programs');
    log.info('Initializing sections');
    return Promise.each(sections, section => section.initialize())
      .tap(() => log.debug('Initialized sections'))
      .then(() => {
        log.info('Scheduling programs');
        return Promise.each(programs, program => program.schedule());
      })
      .tap(() => log.debug('Scheduled programs'))
      .then(() => {
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
      });
  });

import express from 'express';
import bodyParser from 'body-parser';
import expressBunyan from 'express-bunyan-logger';
import {resolve} from 'path';

import {HttpError, validationErrorHandler, syntaxErrorHandler} from './errors';
import webpackDev from './util/webpackDev';
import * as routes from './routes'

const app = express();

if (config.webpackDev) {
  log.warn('Using webpack dev middleware');
  webpackDev(app);
}

app.use(expressBunyan(config.server.logger));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/sections', routes.sections);
app.use('/api/programs', routes.programs);
app.use('/api/sse', routes.sse.route);

app.use(express.static(resolve(__dirname, '..', 'public')));
app.get('*', function (req, res){
  res.sendFile(resolve(__dirname, '..', 'public', 'index.html'))
});

app.use(validationErrorHandler);
app.use(syntaxErrorHandler);
app.use(HttpError.handler);

var PORT = process.env.PORT || config.server.port;
var server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;
  log.info({ address: server.address() }, `Sprinklers server listening at http://${host}:${port}`);
});

export default app;
