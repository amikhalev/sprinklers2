'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _basicAuth = require('basic-auth');

var _basicAuth2 = _interopRequireDefault(_basicAuth);

var users = require('./test-data.json').users;

exports['default'] = function () {
  return function (req, res, next) {
    function unauthorized() {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.send(401);
    }
    var authUser = (0, _basicAuth2['default'])(req);
    if (!authUser || !authUser.name || !authUser.pass) {
      return unauthorized();
    }
    if (users.some(function (user) {
      return user.name === authUser.name && user.password === authUser.pass;
    })) {
      return next();
    } else {
      return unauthorized();
    }
  };
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9hdXRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3lCQUFpQixZQUFZOzs7O0FBQzdCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7cUJBRS9CLFlBQVk7QUFDekIsU0FBTyxVQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFLO0FBQ3pCLGFBQVMsWUFBWSxHQUFHO0FBQ3RCLFNBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsb0NBQW9DLENBQUMsQ0FBQztBQUNsRSxhQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDdEI7QUFDRCxRQUFJLFFBQVEsR0FBRyw0QkFBSyxHQUFHLENBQUMsQ0FBQztBQUN6QixRQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7QUFDakQsYUFBTyxZQUFZLEVBQUUsQ0FBQztLQUN2QjtBQUNELFFBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7YUFBSSxJQUFLLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxJQUFJLElBQU0sSUFBSSxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsSUFBSTtLQUFDLENBQUMsRUFBRTtBQUMxRixhQUFPLElBQUksRUFBRSxDQUFDO0tBQ2YsTUFBTTtBQUNMLGFBQU8sWUFBWSxFQUFFLENBQUM7S0FDdkI7R0FDRixDQUFDO0NBQ0giLCJmaWxlIjoibGliL2F1dGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXV0aCBmcm9tICdiYXNpYy1hdXRoJztcbmxldCB1c2VycyA9IHJlcXVpcmUoJy4vdGVzdC1kYXRhLmpzb24nKS51c2VycztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgZnVuY3Rpb24gdW5hdXRob3JpemVkKCkge1xuICAgICAgcmVzLnNldCgnV1dXLUF1dGhlbnRpY2F0ZScsICdCYXNpYyByZWFsbT1BdXRob3JpemF0aW9uIFJlcXVpcmVkJyk7XG4gICAgICByZXR1cm4gcmVzLnNlbmQoNDAxKTtcbiAgICB9XG4gICAgdmFyIGF1dGhVc2VyID0gYXV0aChyZXEpO1xuICAgIGlmICghYXV0aFVzZXIgfHwgIWF1dGhVc2VyLm5hbWUgfHwgIWF1dGhVc2VyLnBhc3MpIHtcbiAgICAgIHJldHVybiB1bmF1dGhvcml6ZWQoKTtcbiAgICB9XG4gICAgaWYgKHVzZXJzLnNvbWUodXNlciA9PiAodXNlci5uYW1lID09PSBhdXRoVXNlci5uYW1lKSAmJiAodXNlci5wYXNzd29yZCA9PT0gYXV0aFVzZXIucGFzcykpKSB7XG4gICAgICByZXR1cm4gbmV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdW5hdXRob3JpemVkKCk7XG4gICAgfVxuICB9O1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9