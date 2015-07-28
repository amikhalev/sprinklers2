'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.validationErrorHandler = validationErrorHandler;
exports.syntaxErrorHandler = syntaxErrorHandler;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _expressValidation = require('express-validation');

var _lodash = require('lodash');

var HttpError = (function (_Error) {
  _inherits(HttpError, _Error);

  _createClass(HttpError, null, [{
    key: 'handler',
    value: function handler(err, req, res, next) {
      if (err instanceof HttpError) {
        res.status(err.status).json(err);
      } else {
        next(err);
      }
    }
  }]);

  function HttpError(name, status, message, data) {
    _classCallCheck(this, HttpError);

    _get(Object.getPrototypeOf(HttpError.prototype), 'constructor', this).call(this);
    this.status = status || 500;
    this.statusText = _httpStatus2['default'][this.status];
    this.name = name || this.statusText || 'HttpError';
    this.message = message || 'There was a generic error';
    this.data = data;
  }

  return HttpError;
})(Error);

exports.HttpError = HttpError;

var NotFound = (function (_HttpError) {
  _inherits(NotFound, _HttpError);

  function NotFound(what, data) {
    _classCallCheck(this, NotFound);

    _get(Object.getPrototypeOf(NotFound.prototype), 'constructor', this).call(this, 'NotFound', 404, what + ' not found', data);
  }

  return NotFound;
})(HttpError);

exports.NotFound = NotFound;

var BadRequest = (function (_HttpError2) {
  _inherits(BadRequest, _HttpError2);

  function BadRequest(message, data) {
    _classCallCheck(this, BadRequest);

    _get(Object.getPrototypeOf(BadRequest.prototype), 'constructor', this).call(this, 'BadRequest', 400, message, data);
  }

  return BadRequest;
})(HttpError);

exports.BadRequest = BadRequest;

function validationErrorHandler(err, req, res, next) {
  if (err instanceof _expressValidation.ValidationError) {
    var message = (0, _lodash.flatten)(err.errors.map(function (error) {
      return error.messages;
    })).join('\n');
    next(new BadRequest(message, err.errors));
  } else {
    next(err);
  }
}

function syntaxErrorHandler(err, req, res, next) {
  if (err instanceof SyntaxError) {
    var data = {
      body: err.body,
      filename: err.filename,
      lineNumber: err.lineNumber,
      columnNumber: err.columnNumber
    };
    var _status = 400;
    if (err.filename) {
      data.stack = err.stack;
      _status = 500;
    }
    res.status(_status).json({
      message: err.toString(),
      status: _status,
      data: data
    });
  } else {
    console.log('err: ' + require('util').inspect(err));
    next(err);
  }
}
//# sourceMappingURL=data:application/json;base64,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LENBQUM7QUFDRixRQUFJLE9BQU0sR0FBRyxHQUFHLENBQUM7QUFDakIsUUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUN2QixhQUFNLEdBQUcsR0FBRyxDQUFDO0tBQ2Q7QUFDRCxPQUFHLENBQUMsTUFBTSxDQUFDLE9BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQztBQUN0QixhQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRTtBQUN2QixZQUFNLEVBQU4sT0FBTTtBQUNOLFVBQUksRUFBSixJQUFJO0tBQ0wsQ0FBQyxDQUFDO0dBQ0osTUFBTTtBQUNMLFdBQU8sQ0FBQyxHQUFHLFdBQVMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBRyxDQUFDO0FBQ3BELFFBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUNYO0NBQ0YiLCJmaWxlIjoibGliL2Vycm9ycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIVFRQU3RhdHVzIGZyb20gJ2h0dHAtc3RhdHVzJztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICdleHByZXNzLXZhbGlkYXRpb24nO1xuaW1wb3J0IHtmbGF0dGVufSBmcm9tICdsb2Rhc2gnO1xuXG5leHBvcnQgY2xhc3MgSHR0cEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBzdGF0aWMgaGFuZGxlcihlcnIsIHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgaWYgKGVyciBpbnN0YW5jZW9mIEh0dHBFcnJvcikge1xuICAgICAgcmVzLnN0YXR1cyhlcnIuc3RhdHVzKVxuICAgICAgICAuanNvbihlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0KGVycik7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IobmFtZSwgc3RhdHVzLCBtZXNzYWdlLCBkYXRhKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cyB8fCA1MDA7XG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gSFRUUFN0YXR1c1t0aGlzLnN0YXR1c107XG4gICAgdGhpcy5uYW1lID0gbmFtZSB8fCB0aGlzLnN0YXR1c1RleHQgfHwgJ0h0dHBFcnJvcic7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSB8fCAnVGhlcmUgd2FzIGEgZ2VuZXJpYyBlcnJvcic7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm90Rm91bmQgZXh0ZW5kcyBIdHRwRXJyb3Ige1xuICBjb25zdHJ1Y3Rvcih3aGF0LCBkYXRhKSB7XG4gICAgc3VwZXIoJ05vdEZvdW5kJywgNDA0LCBgJHt3aGF0fSBub3QgZm91bmRgLCBkYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmFkUmVxdWVzdCBleHRlbmRzIEh0dHBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIGRhdGEpIHtcbiAgICBzdXBlcignQmFkUmVxdWVzdCcsIDQwMCwgbWVzc2FnZSwgZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRpb25FcnJvckhhbmRsZXIoZXJyLCByZXEsIHJlcywgbmV4dCkge1xuICBpZiAoZXJyIGluc3RhbmNlb2YgVmFsaWRhdGlvbkVycm9yKSB7XG4gICAgbGV0IG1lc3NhZ2UgPSBmbGF0dGVuKGVyci5lcnJvcnMubWFwKGVycm9yID0+IGVycm9yLm1lc3NhZ2VzKSkuam9pbignXFxuJyk7XG4gICAgbmV4dChuZXcgQmFkUmVxdWVzdChtZXNzYWdlLCBlcnIuZXJyb3JzKSk7XG4gIH0gZWxzZSB7XG4gICAgbmV4dChlcnIpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzeW50YXhFcnJvckhhbmRsZXIgKGVyciwgcmVxLCByZXMsIG5leHQpIHtcbiAgaWYgKGVyciBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XG4gICAgbGV0IGRhdGEgPSB7XG4gICAgICBib2R5OiBlcnIuYm9keSxcbiAgICAgIGZpbGVuYW1lOiBlcnIuZmlsZW5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiBlcnIubGluZU51bWJlcixcbiAgICAgIGNvbHVtbk51bWJlcjogZXJyLmNvbHVtbk51bWJlclxuICAgIH07XG4gICAgbGV0IHN0YXR1cyA9IDQwMDtcbiAgICBpZiAoZXJyLmZpbGVuYW1lKSB7XG4gICAgICBkYXRhLnN0YWNrID0gZXJyLnN0YWNrO1xuICAgICAgc3RhdHVzID0gNTAwO1xuICAgIH1cbiAgICByZXMuc3RhdHVzKHN0YXR1cykuanNvbih7XG4gICAgICBtZXNzYWdlOiBlcnIudG9TdHJpbmcoKSxcbiAgICAgIHN0YXR1cyxcbiAgICAgIGRhdGFcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhgZXJyOiAke3JlcXVpcmUoJ3V0aWwnKS5pbnNwZWN0KGVycil9YCk7XG4gICAgbmV4dChlcnIpO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=