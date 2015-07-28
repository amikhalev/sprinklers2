'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _bluebird = require('bluebird');

var _lodash = require('lodash');

var fs = (0, _bluebird.promisifyAll)(require('fs'));

var DATA = './lib/test-data.json';

var Model = (function () {
  function Model(data) {
    _classCallCheck(this, Model);

    var props = this.constructor.persistantProps;
    (0, _lodash.assign)(this, (0, _lodash.pick)(data, props.concat(['id'])));
  }

  _createClass(Model, [{
    key: 'save',
    value: function save() {
      var _this = this;

      return fs.readFileAsync(DATA).then(function (json) {
        return JSON.parse(json);
      }).then(function (data) {
        data[_this.constructor.name][_this.id] = (0, _lodash.pick)(_this, _this.constructor.persistantProps);
        return data;
      }).then(function (data) {
        return JSON.stringify(data);
      }).then(function (json) {
        return fs.writeFileAsync(DATA, json);
      });
    }
  }], [{
    key: 'list',
    value: function list() {
      var _this2 = this;

      if (!this.instances) {
        return fs.readFileAsync(DATA).then(function (json) {
          return JSON.parse(json);
        }).get(this.name).map(function (datum, i) {
          datum.id = i;
          return new _this2(datum);
        }).tap(function (instances) {
          return _this2.instances = instances;
        });
      } else {
        return (0, _bluebird.resolve)(this.instances);
      }
    }
  }]);

  return Model;
})();

exports['default'] = Model;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9tb2RlbHMvTW9kZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozt3QkFBb0MsVUFBVTs7c0JBQ25CLFFBQVE7O0FBQ25DLElBQU0sRUFBRSxHQUFHLGNBRk0sWUFBWSxFQUVMLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUV2QyxJQUFNLElBQUksR0FBRyxzQkFBc0IsQ0FBQzs7SUFFZixLQUFLO0FBQ2IsV0FEUSxLQUFLLENBQ1osSUFBSSxFQUFFOzBCQURDLEtBQUs7O0FBRXRCLFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDO0FBQzdDLGdCQVJJLE1BQU0sRUFRSCxJQUFJLEVBQUUsWUFSRCxJQUFJLEVBUUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNoRDs7ZUFKa0IsS0FBSzs7V0FxQnBCLGdCQUFHOzs7QUFDTCxhQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQzFCLElBQUksQ0FBQyxVQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztPQUFBLENBQUMsQ0FDOUIsSUFBSSxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ1osWUFBSSxDQUFDLE1BQUssV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQUssRUFBRSxDQUFDLEdBQUcsWUE5Qi9CLElBQUksU0E4QnNDLE1BQUssV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3BGLGVBQU8sSUFBSSxDQUFDO09BQ2IsQ0FBQyxDQUNELElBQUksQ0FBQyxVQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztPQUFBLENBQUMsQ0FDbEMsSUFBSSxDQUFDLFVBQUEsSUFBSTtlQUFJLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztPQUFBLENBQUMsQ0FBQztLQUNoRDs7O1dBeEJVLGdCQUFHOzs7QUFDWixVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNuQixlQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQzFCLElBQUksQ0FBQyxVQUFBLElBQUk7aUJBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7U0FBQSxDQUFDLENBQzlCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ2QsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLENBQUMsRUFBSztBQUNqQixlQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNiLGlCQUFPLFdBQVMsS0FBSyxDQUFDLENBQUM7U0FDeEIsQ0FBQyxDQUNELEdBQUcsQ0FBQyxVQUFBLFNBQVM7aUJBQUksT0FBSyxTQUFTLEdBQUcsU0FBUztTQUFBLENBQUMsQ0FBQztPQUNqRCxNQUFNO0FBQ0wsZUFBTyxjQXZCTCxPQUFPLEVBdUJNLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztPQUNoQztLQUNGOzs7U0FuQmtCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6ImxpYi9tb2RlbHMvTW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3Jlc29sdmUsIHByb21pc2lmeUFsbH0gZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHthc3NpZ24sIHBpY2t9IGZyb20gJ2xvZGFzaCc7XG5jb25zdCBmcyA9IHByb21pc2lmeUFsbChyZXF1aXJlKCdmcycpKTtcblxuY29uc3QgREFUQSA9ICcuL2xpYi90ZXN0LWRhdGEuanNvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIGxldCBwcm9wcyA9IHRoaXMuY29uc3RydWN0b3IucGVyc2lzdGFudFByb3BzO1xuICAgIGFzc2lnbih0aGlzLCBwaWNrKGRhdGEsIHByb3BzLmNvbmNhdChbJ2lkJ10pKSk7XG4gIH1cblxuICBzdGF0aWMgbGlzdCgpIHtcbiAgICBpZiAoIXRoaXMuaW5zdGFuY2VzKSB7XG4gICAgICByZXR1cm4gZnMucmVhZEZpbGVBc3luYyhEQVRBKVxuICAgICAgICAudGhlbihqc29uID0+IEpTT04ucGFyc2UoanNvbikpXG4gICAgICAgIC5nZXQodGhpcy5uYW1lKVxuICAgICAgICAubWFwKChkYXR1bSwgaSkgPT4ge1xuICAgICAgICAgIGRhdHVtLmlkID0gaTtcbiAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoZGF0dW0pO1xuICAgICAgICB9KVxuICAgICAgICAudGFwKGluc3RhbmNlcyA9PiB0aGlzLmluc3RhbmNlcyA9IGluc3RhbmNlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXNvbHZlKHRoaXMuaW5zdGFuY2VzKTtcbiAgICB9XG4gIH1cblxuICBzYXZlKCkge1xuICAgIHJldHVybiBmcy5yZWFkRmlsZUFzeW5jKERBVEEpXG4gICAgICAudGhlbihqc29uID0+IEpTT04ucGFyc2UoanNvbikpXG4gICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgZGF0YVt0aGlzLmNvbnN0cnVjdG9yLm5hbWVdW3RoaXMuaWRdID0gcGljayh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yLnBlcnNpc3RhbnRQcm9wcyk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGRhdGEgPT4gSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG4gICAgICAudGhlbihqc29uID0+IGZzLndyaXRlRmlsZUFzeW5jKERBVEEsIGpzb24pKTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9