'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

exports['default'] = function (name, conf) {
  conf = _lodash2['default'].defaultsDeep(conf || {}, _config2['default'].bunyan);
  conf.name = name || 'app';
  return _bunyan2['default'].createLogger(conf);
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9sb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7c0JBQW1CLFFBQVE7Ozs7c0JBQ2IsUUFBUTs7OztzQkFFSCxVQUFVOzs7O3FCQUVkLFVBQVUsSUFBSSxFQUFFLElBQUksRUFBRTtBQUNuQyxNQUFJLEdBQUcsb0JBQUUsWUFBWSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsb0JBQU8sTUFBTSxDQUFDLENBQUM7QUFDakQsTUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksS0FBSyxDQUFDO0FBQzFCLFNBQU8sb0JBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ2xDIiwiZmlsZSI6ImxpYi9sb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYnVueWFuIGZyb20gJ2J1bnlhbic7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG5hbWUsIGNvbmYpIHtcbiAgY29uZiA9IF8uZGVmYXVsdHNEZWVwKGNvbmYgfHwge30sIGNvbmZpZy5idW55YW4pO1xuICBjb25mLm5hbWUgPSBuYW1lIHx8ICdhcHAnO1xuICByZXR1cm4gYnVueWFuLmNyZWF0ZUxvZ2dlcihjb25mKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==