import HTTPStatus from 'http-status';
import {ValidationError} from 'express-validation';
import {ValidationError as SequelizeValidationError} from 'sequelize';
import {flatten} from 'lodash';
import createLogger from './createLogger';

export class HttpError extends Error {
  static handler(err, req, res, next) {
    if (err instanceof HttpError || err._is_HttpError) {
      res.status(err.status)
        .json(err);
    } else {
      next(err);
    }
  }

  constructor(name, status, message, data) {
    super();
    this.status = status || 500;
    this.statusText = HTTPStatus[ this.status ];
    this.name = name || this.statusText || 'HttpError';
    this.message = message || 'There was a generic error';
    this.data = data;
    // I don't know what express is doing. I don't know what babel is doing. Something is doing
    // something that makes instanceof not work correctly in handler(). So I give up.
    this._is_HttpError = true;
  }
}

export class NotFound extends HttpError {
  constructor(what, data) {
    super('NotFound', 404, `${what} not found`, data);
  }
}

export class BadRequest extends HttpError {
  constructor(message, data) {
    super('BadRequest', 400, message, data);
  }
}

export function validationErrorHandler(log) {
  return function (err, req, res, next) {
    if (err instanceof ValidationError) {
      log.debug(err, 'Request had Joi validation error');
      let message = flatten(err.errors.map(error => error.messages)).join('\n');
      next(new BadRequest(message, err.errors));
    } else if (err instanceof SequelizeValidationError) {
      log.debug(err, 'Request had Sequelize validation error');
      let message = flatten(err.errors.map(errorItem => errorItem.message)).join('\n');
      next(new BadRequest(message, err.errors));
    } else {
      next(err);
    }
  }
}

export function nodeErrorHandler(log) {
  return (err, req, res, next) => {
    if (err instanceof SyntaxError || err instanceof TypeError || err instanceof ReferenceError) {
      //let data = {
      //  body: err.body,
      //  filename: err.filename,
      //  lineNumber: err.lineNumber,
      //  columnNumber: err.columnNumber
      //};
      //if (err.filename) {
      //  data.stack = err.stack;
      //}
      //const status = 500;
      //res.status(status).json({
      //  message: err.toString(),
      //  status,
      //  data
      //});
      log.error(err, 'Uncaught Javascript Exception');
      next(err);
    } else {
      next(err);
    }
  };
}
