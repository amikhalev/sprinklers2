import Promise from 'bluebird';

Promise.config({
  // Enable warnings and cancellation
  warnings: true,
  cancellation: true
});

import argv from './arguments';

import createLogger from './util/createLogger';
const log = createLogger('server');

import config from './config/index';

import {Section, Program, sequelize} from './models/index';
import {createTestData} from './util/test-data';

import app from './app';
import executor from './executor';

process.on('exit', (code) => {
  log.info({ code }, 'Exiting...');
});

process.on('SIGINT', () => {
  log.info('Cleaning up');
  return Section.findAll()
    .each(section => section.deinitialize())
    .then(() => {
      /*eslint no-process-exit: 0*/
      process.exit(0);
    }, err => {
      log.error(err, 'Error while cleaning up');
      process.exit(-1);
    });
});

const nodeEnv = process.env.NODE_ENV;
log.debug({ nodeEnv });

Section.initGpio();

function initSequelize() {
  log.info('Initializing Sequelize');
  log.trace(`models: ${Object.keys(sequelize.models)}`);
  return sequelize.sync()
    .tap(() => log.debug('Models synced'))
    .then(() => Program.count())
    .then(count => {
      if (argv['test-data']) {
        log.debug('Creating test data');
        return createTestData()
          .tap(() => log.info('Created test data'));
      }
    })
    .catch(err => {
      log.error(err, 'Error during Sequelize initialization');
      process.exit(-1);
    })
}

function initSections() {
  log.info('Initializing sections');
  return Section.findAll()
    .each(section => section.initialize())
    .then(() => log.debug('Initialized sections'))
    .catch(err => log.error(err, 'Error while initializing sections'));
}

function initPrograms() {
  log.info('Scheduling programs');
  return Program.findAll()
    .each(program => program.ensureScheduled())
    .then(() => log.debug('Scheduled programs'))
    .catch(err => log.error(err, 'Error while scheduling programs'));
}

function startServer() {
  const PORT = process.env.PORT || config.server.port;
  const server = app.listen(PORT, () => {
    const host = server.address().address;
    const port = server.address().port;
    log.info({ address: server.address() }, `Sprinklers server listening at http://${host}:${port}`);
  });
}

initSequelize()
  .then(initSections)
  .then(initPrograms)
  .then(startServer);