'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _later = require('later');

var _later2 = _interopRequireDefault(_later);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Model2 = require('./Model');

var _Model3 = _interopRequireDefault(_Model2);

var _SectionJs = require('./Section.js');

var _SectionJs2 = _interopRequireDefault(_SectionJs);

var _routesSseJs = require('../routes/sse.js');

var _routesSseJs2 = _interopRequireDefault(_routesSseJs);

var baseLog = require('../log')('Program');

var _setTimeout = global.setTimeout;
global.setTimeout = function (fn, ms) {
  baseLog.warn({ fn: fn, ms: ms }, 'setTimeout');
  _setTimeout(fn, ms);
};

_later2['default'].date.localTime();

var Program = (function (_Model) {
  _inherits(Program, _Model);

  _createClass(Program, null, [{
    key: 'persistantProps',
    value: ['enabled', 'name', 'when', 'times'],
    enumerable: true
  }]);

  function Program(data) {
    _classCallCheck(this, Program);

    _get(Object.getPrototypeOf(Program.prototype), 'constructor', this).call(this, data);
    this.running = false;
    this.clear = null;
    this.log = baseLog.child({
      program: this.name
    });
    this.schedule();
  }

  _createClass(Program, [{
    key: 'data',
    value: function data() {
      return _lodash2['default'].pick(this, Program.persistantProps.concat(['running']));
    }
  }, {
    key: 'execute',
    value: function execute() {
      var _this = this;

      this.log.info('Executing program');
      this.running = true;
      Program.update();
      return _SectionJs2['default'].list().each(function (section, index) {
        return section.runFor(_this.times[index]);
      }).then(function () {
        _this.log.info('Finished executing');
        _this.running = false;
        Program.update();
      });
    }
  }, {
    key: 'schedule',
    value: function schedule() {
      var _this2 = this;

      if (this.clear !== null) {
        this.log.info('Already scheduled, descheduling');
        this.deschedule();
      }
      if (!this.enabled) {
        this.log.info('Program is disabled');
        return;
      }
      var sched = _later2['default'].parse.text(this.when);
      if (sched.error !== -1) {
        this.log.error('Invalid schedule: ');
        this.log.error(this.when);
        this.log.error(new Array(sched.error + 1).join('-') + '^');
        return;
      }
      this.clear = _later2['default'].setInterval(function () {
        return _this2.execute().then(function () {
          var next = _later2['default'].schedule(sched).next(1).toString();
          _this2.log.info({ next: next }, 'Finished running');
        });
      }, sched).clear;
      var next = _later2['default'].schedule(sched).next(1).toString();
      this.log.info({ when: this.when, next: next }, 'Program scheduled');
    }
  }, {
    key: 'deschedule',
    value: function deschedule() {
      if (this.clear != null) {
        this.log.info('Descheduling program');
        this.clear();
        this.clear = null;
      }
    }
  }], [{
    key: 'update',
    value: function update() {
      Program.list().map(function (program) {
        return program.data();
      }).then(function (programs) {
        return _routesSseJs2['default'].send(programs, 'programs');
      });
    }
  }]);

  return Program;
})(_Model3['default']);

exports['default'] = Program;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9tb2RlbHMvUHJvZ3JhbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3FCQUFrQixPQUFPOzs7O3NCQUNYLFFBQVE7Ozs7c0JBQ0osU0FBUzs7Ozt5QkFTUCxjQUFjOzs7OzJCQUNsQixrQkFBa0I7Ozs7QUFSbEMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUUzQyxJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3RDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsVUFBUyxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ25DLFNBQU8sQ0FBQyxJQUFJLENBQUMsRUFBQyxFQUFFLEVBQUYsRUFBRSxFQUFFLEVBQUUsRUFBRixFQUFFLEVBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNyQyxhQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0NBQ3JCLENBQUM7O0FBSUYsbUJBQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDOztJQUVGLE9BQU87WUFBUCxPQUFPOztlQUFQLE9BQU87O1dBQ0QsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUM7Ozs7QUFFbEQsV0FIUSxPQUFPLENBR2QsSUFBSSxFQUFFOzBCQUhDLE9BQU87O0FBSXhCLCtCQUppQixPQUFPLDZDQUlsQixJQUFJLEVBQUU7QUFDWixRQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUNyQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixRQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDdkIsYUFBTyxFQUFFLElBQUksQ0FBQyxJQUFJO0tBQ25CLENBQUMsQ0FBQztBQUNILFFBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztHQUNqQjs7ZUFYa0IsT0FBTzs7V0FtQnRCLGdCQUFHO0FBQ0wsYUFBTyxvQkFB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QUFDO09BQ25CO0tBQ0Y7OztXQXhEWSxrQkFBRztBQUNkLGFBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FDWCxHQUFHLENBQUMsVUFBQSxPQUFPO2VBQUksT0FBTyxDQUFDLElBQUksRUFBRTtPQUFBLENBQUMsQ0FDOUIsSUFBSSxDQUFDLFVBQUEsUUFBUTtlQUFJLHlCQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQ3JEOzs7U0FqQmtCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6ImxpYi9tb2RlbHMvUHJvZ3JhbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsYXRlciBmcm9tICdsYXRlcic7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IE1vZGVsIGZyb20gJy4vTW9kZWwnO1xuXG5sZXQgYmFzZUxvZyA9IHJlcXVpcmUoJy4uL2xvZycpKCdQcm9ncmFtJyk7XG5cbmNvbnN0IF9zZXRUaW1lb3V0ID0gZ2xvYmFsLnNldFRpbWVvdXQ7XG5nbG9iYWwuc2V0VGltZW91dCA9IGZ1bmN0aW9uKGZuLCBtcykge1xuICBiYXNlTG9nLndhcm4oe2ZuLCBtc30sICdzZXRUaW1lb3V0Jyk7XG4gIF9zZXRUaW1lb3V0KGZuLCBtcyk7XG59O1xuaW1wb3J0IFNlY3Rpb24gZnJvbSAnLi9TZWN0aW9uLmpzJztcbmltcG9ydCBzc2UgZnJvbSAnLi4vcm91dGVzL3NzZS5qcyc7XG5cbmxhdGVyLmRhdGUubG9jYWxUaW1lKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2dyYW0gZXh0ZW5kcyBNb2RlbCB7XG4gIHN0YXRpYyBwZXJzaXN0YW50UHJvcHMgPSBbJ2VuYWJsZWQnLCAnbmFtZScsICd3aGVuJywgJ3RpbWVzJ107XG5cbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKGRhdGEpO1xuICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgIHRoaXMuY2xlYXIgPSBudWxsO1xuICAgIHRoaXMubG9nID0gYmFzZUxvZy5jaGlsZCh7XG4gICAgICBwcm9ncmFtOiB0aGlzLm5hbWVcbiAgICB9KTtcbiAgICB0aGlzLnNjaGVkdWxlKCk7XG4gIH1cblxuICBzdGF0aWMgdXBkYXRlKCkge1xuICAgIFByb2dyYW0ubGlzdCgpXG4gICAgICAubWFwKHByb2dyYW0gPT4gcHJvZ3JhbS5kYXRhKCkpXG4gICAgICAudGhlbihwcm9ncmFtcyA9PiBzc2Uuc2VuZChwcm9ncmFtcywgJ3Byb2dyYW1zJykpO1xuICB9XG5cbiAgZGF0YSgpIHtcbiAgICByZXR1cm4gXy5waWNrKHRoaXMsIFByb2dyYW0ucGVyc2lzdGFudFByb3BzLmNvbmNhdChbJ3J1bm5pbmcnXSkpO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLmxvZy5pbmZvKCdFeGVjdXRpbmcgcHJvZ3JhbScpO1xuICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgUHJvZ3JhbS51cGRhdGUoKTtcbiAgICByZXR1cm4gU2VjdGlvbi5saXN0KClcbiAgICAgIC5lYWNoKChzZWN0aW9uLCBpbmRleCkgPT4gc2VjdGlvbi5ydW5Gb3IodGhpcy50aW1lc1tpbmRleF0pKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmxvZy5pbmZvKCdGaW5pc2hlZCBleGVjdXRpbmcnKTtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIFByb2dyYW0udXBkYXRlKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHNjaGVkdWxlKCkge1xuICAgIGlmICh0aGlzLmNsZWFyICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmxvZy5pbmZvKCdBbHJlYWR5IHNjaGVkdWxlZCwgZGVzY2hlZHVsaW5nJyk7XG4gICAgICB0aGlzLmRlc2NoZWR1bGUoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMubG9nLmluZm8oJ1Byb2dyYW0gaXMgZGlzYWJsZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHNjaGVkID0gbGF0ZXIucGFyc2UudGV4dCh0aGlzLndoZW4pO1xuICAgIGlmIChzY2hlZC5lcnJvciAhPT0gLTEpIHtcbiAgICAgIHRoaXMubG9nLmVycm9yKCdJbnZhbGlkIHNjaGVkdWxlOiAnKTtcbiAgICAgIHRoaXMubG9nLmVycm9yKHRoaXMud2hlbik7XG4gICAgICB0aGlzLmxvZy5lcnJvcihuZXcgQXJyYXkoc2NoZWQuZXJyb3IgKyAxKS5qb2luKCctJykgKyAnXicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmNsZWFyID0gbGF0ZXIuc2V0SW50ZXJ2YWwoKCkgPT5cbiAgICAgICAgdGhpcy5leGVjdXRlKClcbiAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbmV4dCA9IGxhdGVyLnNjaGVkdWxlKHNjaGVkKS5uZXh0KDEpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0aGlzLmxvZy5pbmZvKHtuZXh0fSwgJ0ZpbmlzaGVkIHJ1bm5pbmcnKTtcbiAgICAgICAgICB9KVxuICAgICAgLCBzY2hlZCkuY2xlYXI7XG4gICAgbGV0IG5leHQgPSBsYXRlci5zY2hlZHVsZShzY2hlZCkubmV4dCgxKS50b1N0cmluZygpO1xuICAgIHRoaXMubG9nLmluZm8oe3doZW46IHRoaXMud2hlbiwgbmV4dH0sICdQcm9ncmFtIHNjaGVkdWxlZCcpO1xuICB9XG5cbiAgZGVzY2hlZHVsZSgpIHtcbiAgICBpZiAodGhpcy5jbGVhciAhPSBudWxsKSB7XG4gICAgICB0aGlzLmxvZy5pbmZvKCdEZXNjaGVkdWxpbmcgcHJvZ3JhbScpO1xuICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgdGhpcy5jbGVhciA9IG51bGw7XG4gICAgfVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=