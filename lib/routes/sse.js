'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require('events');

var instance;

var Sse = (function (_EventEmitter) {
  _inherits(Sse, _EventEmitter);

  function Sse() {
    _classCallCheck(this, Sse);

    _get(Object.getPrototypeOf(Sse.prototype), 'constructor', this).call(this);
  }

  _createClass(Sse, [{
    key: 'route',
    value: function route(req, res) {
      var eventCount = 0;

      function send(data, type) {
        if (type) {
          res.write('event: ' + type + '\n');
        }
        res.write('id: ' + eventCount++ + '\n');
        res.write('data: ' + data + '\n\n');
      }

      instance.addListener('send', send);
      res.setTimeout(0);
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      res.write('\n');

      req.on('close', function () {
        return instance.removeListener('send', send);
      });
    }
  }, {
    key: 'send',
    value: function send(data, type) {
      this.emit('send', JSON.stringify({ data: data }), type);
    }
  }]);

  return Sse;
})(_events.EventEmitter);

instance = new Sse();

exports['default'] = instance;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yb3V0ZXMvc3NlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3NCQUEyQixRQUFROztBQUVuQyxJQUFJLFFBQVEsQ0FBQzs7SUFFUCxHQUFHO1lBQUgsR0FBRzs7QUFDSSxXQURQLEdBQUcsR0FDTzswQkFEVixHQUFHOztBQUVMLCtCQUZFLEdBQUcsNkNBRUc7R0FDVDs7ZUFIRyxHQUFHOztXQUtGLGVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUNkLFVBQUksVUFBVSxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsZUFBUyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUN4QixZQUFJLElBQUksRUFBRTtBQUNSLGFBQUcsQ0FBQyxLQUFLLGFBQVcsSUFBSSxRQUFLLENBQUM7U0FDL0I7QUFDRCxXQUFHLENBQUMsS0FBSyxVQUFRLFVBQVUsRUFBRSxRQUFLLENBQUM7QUFDbkMsV0FBRyxDQUFDLEtBQUssWUFBVSxJQUFJLFVBQU8sQ0FBQztPQUNoQzs7QUFFRCxjQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuQyxTQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLFNBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO0FBQ2pCLHNCQUFjLEVBQUUsbUJBQW1CO0FBQ25DLHVCQUFlLEVBQUUsVUFBVTtBQUMzQixvQkFBWSxFQUFFLFlBQVk7T0FDM0IsQ0FBQyxDQUFDO0FBQ0gsU0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEIsU0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7ZUFBTSxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDOUQ7OztXQUVHLGNBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUNmLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxJQUFJLEVBQUosSUFBSSxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNqRDs7O1NBOUJHLEdBQUc7V0FKRCxZQUFZOztBQXFDcEIsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O3FCQUVOLFFBQVEiLCJmaWxlIjoibGliL3JvdXRlcy9zc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0V2ZW50RW1pdHRlcn0gZnJvbSAnZXZlbnRzJztcblxudmFyIGluc3RhbmNlO1xuXG5jbGFzcyBTc2UgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcm91dGUocmVxLCByZXMpIHtcbiAgICBsZXQgZXZlbnRDb3VudCA9IDA7XG5cbiAgICBmdW5jdGlvbiBzZW5kKGRhdGEsIHR5cGUpIHtcbiAgICAgIGlmICh0eXBlKSB7XG4gICAgICAgIHJlcy53cml0ZShgZXZlbnQ6ICR7dHlwZX1cXG5gKTtcbiAgICAgIH1cbiAgICAgIHJlcy53cml0ZShgaWQ6ICR7ZXZlbnRDb3VudCsrfVxcbmApO1xuICAgICAgcmVzLndyaXRlKGBkYXRhOiAke2RhdGF9XFxuXFxuYCk7XG4gICAgfVxuXG4gICAgaW5zdGFuY2UuYWRkTGlzdGVuZXIoJ3NlbmQnLCBzZW5kKTtcbiAgICByZXMuc2V0VGltZW91dCgwKTtcbiAgICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L2V2ZW50LXN0cmVhbScsXG4gICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZScsXG4gICAgICAnQ29ubmVjdGlvbic6ICdrZWVwLWFsaXZlJ1xuICAgIH0pO1xuICAgIHJlcy53cml0ZSgnXFxuJyk7XG5cbiAgICByZXEub24oJ2Nsb3NlJywgKCkgPT4gaW5zdGFuY2UucmVtb3ZlTGlzdGVuZXIoJ3NlbmQnLCBzZW5kKSk7XG4gIH1cblxuICBzZW5kKGRhdGEsIHR5cGUpIHtcbiAgICB0aGlzLmVtaXQoJ3NlbmQnLCBKU09OLnN0cmluZ2lmeSh7ZGF0YX0pLCB0eXBlKTtcbiAgfVxufVxuXG5pbnN0YW5jZSA9IG5ldyBTc2UoKTtcblxuZXhwb3J0IGRlZmF1bHQgaW5zdGFuY2U7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=