import HTTPStatus from 'http-status';
import {ValidationError} from 'express-validation';
import {flatten} from 'lodash';

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
    this.statusText = HTTPStatus[this.status];
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

export function validationErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    let message = flatten(err.errors.map(error => error.messages)).join('\n');
    next(new BadRequest(message, err.errors));
  } else {
    next(err);
  }
}

export function syntaxErrorHandler (err, req, res, next) {
  if (err instanceof SyntaxError) {
    let data = {
      body: err.body,
      filename: err.filename,
      lineNumber: err.lineNumber,
      columnNumber: err.columnNumber
    };
    let status = 400;
    if (err.filename) {
      data.stack = err.stack;
      status = 500;
    }
    res.status(status).json({
      message: err.toString(),
      status,
      data
    });
  } else {
    console.log(`err: ${require('util').inspect(err)}`);
    next(err);
  }
}
