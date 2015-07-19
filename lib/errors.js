import HTTPStatus from 'http-status';

export class HttpError extends Error {
  static handler(err, req, res, next) {
    if (err instanceof HttpError) {
      res.status(err.status)
        .json(err);
    } else {
      next(err);
    }
  }

  constructor(message, status, name) {
    super();
    this.message = message || 'There was a generic error';
    this.status = status || 500;
    this.name = name || HTTPStatus[this.status] || 'HttpError';
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
    next(err);
  }
}
