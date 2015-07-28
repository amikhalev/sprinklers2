'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Model2 = require('./Model');

var _Model3 = _interopRequireDefault(_Model2);

var _routesSse = require('../routes/sse');

var _routesSse2 = _interopRequireDefault(_routesSse);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var baseLog = require('../log')('section');

var gpio = undefined;
if (_config2['default'].gpioStub) {
  baseLog.info('Using gpioStub');
  gpio = require('./../gpioStub');
} else {
  baseLog.info('Using pi-gpio');
  gpio = require('pi-gpio');
}
gpio = _bluebird2['default'].promisifyAll(gpio);

var Section = (function (_Model) {
  _inherits(Section, _Model);

  _createClass(Section, null, [{
    key: 'persistantProps',
    value: ['name', 'pin'],
    enumerable: true
  }]);

  function Section(data) {
    _classCallCheck(this, Section);

    _get(Object.getPrototypeOf(Section.prototype), 'constructor', this).call(this, data);
    this.endTime = null;
    this.log = baseLog.child({
      section: this.name
    });
  }

  _createClass(Section, [{
    key: 'data',
    value: function data() {
      var _this = this;

      return this.getValue().then(function (value) {
        var section = _lodash2['default'].pick(_this, Section.persistantProps.concat(['endTime']));
        section.value = value;
        return section;
      });
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      var _this2 = this;

      this.log.info({ pin: this.pin }, 'Initializing section');
      return gpio.openAsync(this.pin, 'output')['catch'](function (err) {
        return _this2.log.warn({ pin: _this2.pin, err: err }, 'Pin was already open!');
      }).then(function () {
        return _this2.setValue(0);
      })['catch'](function (err) {
        return _this2.log.error({ err: err }, 'Error initializing section');
      });
    }
  }, {
    key: 'deinitialize',
    value: function deinitialize() {
      var _this3 = this;

      this.log.info('Deinitializing section');
      return gpio.closeAsync(this.pin)['catch'](function (err) {
        return _this3.log.error({ err: err }, 'Error deinitializing section');
      });
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.log.debug({ value: value }, 'Setting section value');
      return gpio.writeAsync(this.pin, value).then(function () {
        return Section.update();
      });
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return gpio.readAsync(this.pin);
    }
  }, {
    key: 'runFor',
    value: function runFor(seconds) {
      var _this4 = this;

      var endTime = new Date();
      endTime.setSeconds(endTime.getSeconds() + seconds);
      this.endTime = endTime;
      this.log.info({ seconds: seconds, endTime: endTime }, 'Running section');
      return this.setValue(1).delay(seconds * 1000).then(function () {
        return _this4.setValue(0);
      }).then(function () {
        _this4.log.info('Finished running section');
        _this4.endTime = null;
      })['catch'](function (err) {
        return _this4.log.error({ err: err }, 'Error while running section');
      });
    }
  }], [{
    key: 'update',
    value: function update() {
      _bluebird2['default'].map(Section.list(), function (section) {
        return section.data();
      }).then(function (sections) {
        return _routesSse2['default'].send(sections, 'sections');
      });
    }
  }]);

  return Section;
})(_Model3['default']);

exports['default'] = Section;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLFVBQUEsT0FBTztlQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7T0FBQSxDQUFDLENBQ25ELElBQUksQ0FBQyxVQUFBLFFBQVE7ZUFBSSx1QkFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQztPQUFBLENBQUMsQ0FBQztLQUNyRDs7O1NBZGtCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6ImxpYi9tb2RlbHMvU2VjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgTW9kZWwgZnJvbSAnLi9Nb2RlbCc7XG5cbmxldCBiYXNlTG9nID0gcmVxdWlyZSgnLi4vbG9nJykoJ3NlY3Rpb24nKTtcbmltcG9ydCBzc2UgZnJvbSAnLi4vcm91dGVzL3NzZSc7XG5cbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnJztcbmxldCBncGlvO1xuaWYgKGNvbmZpZy5ncGlvU3R1Yikge1xuICBiYXNlTG9nLmluZm8oJ1VzaW5nIGdwaW9TdHViJyk7XG4gIGdwaW8gPSByZXF1aXJlKCcuLy4uL2dwaW9TdHViJyk7XG59IGVsc2Uge1xuICBiYXNlTG9nLmluZm8oJ1VzaW5nIHBpLWdwaW8nKTtcbiAgZ3BpbyA9IHJlcXVpcmUoJ3BpLWdwaW8nKTtcbn1cbmdwaW8gPSBQcm9taXNlLnByb21pc2lmeUFsbChncGlvKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VjdGlvbiBleHRlbmRzIE1vZGVsIHtcbiAgc3RhdGljIHBlcnNpc3RhbnRQcm9wcyA9IFsnbmFtZScsICdwaW4nXTtcblxuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoZGF0YSk7XG4gICAgdGhpcy5lbmRUaW1lID0gbnVsbDtcbiAgICB0aGlzLmxvZyA9IGJhc2VMb2cuY2hpbGQoe1xuICAgICAgc2VjdGlvbjogdGhpcy5uYW1lXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgdXBkYXRlKCkge1xuICAgIFByb21pc2UubWFwKFNlY3Rpb24ubGlzdCgpLCBzZWN0aW9uID0+IHNlY3Rpb24uZGF0YSgpKVxuICAgICAgLnRoZW4oc2VjdGlvbnMgPT4gc3NlLnNlbmQoc2VjdGlvbnMsICdzZWN0aW9ucycpKTtcbiAgfVxuXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoKVxuICAgICAgLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICBsZXQgc2VjdGlvbiA9IF8ucGljayh0aGlzLCBTZWN0aW9uLnBlcnNpc3RhbnRQcm9wcy5jb25jYXQoWydlbmRUaW1lJ10pKTtcbiAgICAgICAgc2VjdGlvbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gc2VjdGlvbjtcbiAgICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmxvZy5pbmZvKHtwaW46IHRoaXMucGlufSwgJ0luaXRpYWxpemluZyBzZWN0aW9uJyk7XG4gICAgcmV0dXJuIGdwaW8ub3BlbkFzeW5jKHRoaXMucGluLCAnb3V0cHV0JylcbiAgICAgIC5jYXRjaChlcnIgPT4gdGhpcy5sb2cud2Fybih7cGluOiB0aGlzLnBpbiwgZXJyfSwgJ1BpbiB3YXMgYWxyZWFkeSBvcGVuIScpKVxuICAgICAgLnRoZW4oKCkgPT4gdGhpcy5zZXRWYWx1ZSgwKSlcbiAgICAgIC5jYXRjaChlcnIgPT4gdGhpcy5sb2cuZXJyb3Ioe2Vycn0sICdFcnJvciBpbml0aWFsaXppbmcgc2VjdGlvbicpKTtcbiAgfVxuXG4gIGRlaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmxvZy5pbmZvKCdEZWluaXRpYWxpemluZyBzZWN0aW9uJyk7XG4gICAgcmV0dXJuIGdwaW8uY2xvc2VBc3luYyh0aGlzLnBpbilcbiAgICAgIC5jYXRjaChlcnIgPT4gdGhpcy5sb2cuZXJyb3Ioe2Vycn0sICdFcnJvciBkZWluaXRpYWxpemluZyBzZWN0aW9uJykpO1xuICB9XG5cbiAgc2V0VmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLmxvZy5kZWJ1Zyh7dmFsdWV9LCAnU2V0dGluZyBzZWN0aW9uIHZhbHVlJyk7XG4gICAgcmV0dXJuIGdwaW8ud3JpdGVBc3luYyh0aGlzLnBpbiwgdmFsdWUpXG4gICAgICAudGhlbigoKSA9PiBTZWN0aW9uLnVwZGF0ZSgpKTtcbiAgfVxuXG4gIGdldFZhbHVlKCkge1xuICAgIHJldHVybiBncGlvLnJlYWRBc3luYyh0aGlzLnBpbik7XG4gIH1cblxuICBydW5Gb3Ioc2Vjb25kcykge1xuICAgIGxldCBlbmRUaW1lID0gbmV3IERhdGUoKTtcbiAgICBlbmRUaW1lLnNldFNlY29uZHMoZW5kVGltZS5nZXRTZWNvbmRzKCkgKyBzZWNvbmRzKTtcbiAgICB0aGlzLmVuZFRpbWUgPSBlbmRUaW1lO1xuICAgIHRoaXMubG9nLmluZm8oe3NlY29uZHMsIGVuZFRpbWV9LCAnUnVubmluZyBzZWN0aW9uJyk7XG4gICAgcmV0dXJuIHRoaXMuc2V0VmFsdWUoMSlcbiAgICAgIC5kZWxheShzZWNvbmRzICogMTAwMClcbiAgICAgIC50aGVuKCgpID0+IHRoaXMuc2V0VmFsdWUoMCkpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMubG9nLmluZm8oJ0ZpbmlzaGVkIHJ1bm5pbmcgc2VjdGlvbicpO1xuICAgICAgICB0aGlzLmVuZFRpbWUgPSBudWxsO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnIgPT4gdGhpcy5sb2cuZXJyb3Ioe2Vycn0sICdFcnJvciB3aGlsZSBydW5uaW5nIHNlY3Rpb24nKSk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==