import express from 'express';
import bodyParser from 'body-parser';
import expressBunyan from 'express-bunyan-logger';
import {resolve} from 'path';

import config from './config/index';
import {HttpError, validationErrorHandler, nodeErrorHandler} from './util/errors';
import * as routes from './routes/index'
import webpackDev from './util/webpackDev';
import createLogger from './util/createLogger';
import executor from './executor';
const log = createLogger('app');

const app = express();

app.locals.executor = executor;

app.use(expressBunyan(config.server.logger));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (config.webpackDev) {
  webpackDev(app);
}

app.use('/api/sections', routes.sections);
app.use('/api/programs', routes.programs);
app.use('/api/sse', routes.sse.route);

app.use(express.static(resolve(__dirname, '..', 'public')));
app.get('*', function (req, res){
  res.sendFile(resolve(__dirname, '..', 'public', 'index.html'))
});

app.use(validationErrorHandler(log));
app.use(nodeErrorHandler(log));
app.use(HttpError.handler);

export default app;