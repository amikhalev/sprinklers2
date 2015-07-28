'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _bunyanLoggly = require('bunyan-loggly');

var env = process.env;

exports['default'] = {
  bunyan: {
    streams: [{
      stream: process.stdout
    }, {
      type: 'file',
      level: 'debug',
      path: 'logs/app.log'
    }, {
      type: 'raw',
      stream: new _bunyanLoggly.Bunyan2Loggly({
        token: env.LOGGLY_TOKEN,
        subdomain: env.LOGGLY_SUBDOMAIN
      })
    }]
  },
  gpioStub: false
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb25maWcvcHJvZHVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7NEJBQTRCLGVBQWU7O0FBQzNDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7O3FCQUVUO0FBQ2IsUUFBTSxFQUFFO0FBQ04sV0FBTyxFQUFFLENBQUM7QUFDUixZQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07S0FDdkIsRUFBRTtBQUNELFVBQUksRUFBRSxNQUFNO0FBQ1osV0FBSyxFQUFFLE9BQU87QUFDZCxVQUFJLEVBQUUsY0FBYztLQUNyQixFQUFFO0FBQ0QsVUFBSSxFQUFFLEtBQUs7QUFDWCxZQUFNLEVBQUUsa0JBYk4sYUFBYSxDQWFXO0FBQ3hCLGFBQUssRUFBRSxHQUFHLENBQUMsWUFBWTtBQUN2QixpQkFBUyxFQUFFLEdBQUcsQ0FBQyxnQkFBZ0I7T0FDaEMsQ0FBQztLQUNILENBQUM7R0FDSDtBQUNELFVBQVEsRUFBRSxLQUFLO0NBQ2hCIiwiZmlsZSI6ImxpYi9jb25maWcvcHJvZHVjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QnVueWFuMkxvZ2dseX0gZnJvbSAnYnVueWFuLWxvZ2dseSc7XG5jb25zdCBlbnYgPSBwcm9jZXNzLmVudjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBidW55YW46IHtcbiAgICBzdHJlYW1zOiBbe1xuICAgICAgc3RyZWFtOiBwcm9jZXNzLnN0ZG91dFxuICAgIH0sIHtcbiAgICAgIHR5cGU6ICdmaWxlJyxcbiAgICAgIGxldmVsOiAnZGVidWcnLFxuICAgICAgcGF0aDogJ2xvZ3MvYXBwLmxvZydcbiAgICB9LCB7XG4gICAgICB0eXBlOiAncmF3JyxcbiAgICAgIHN0cmVhbTogbmV3IEJ1bnlhbjJMb2dnbHkoe1xuICAgICAgICB0b2tlbjogZW52LkxPR0dMWV9UT0tFTixcbiAgICAgICAgc3ViZG9tYWluOiBlbnYuTE9HR0xZX1NVQkRPTUFJTlxuICAgICAgfSlcbiAgICB9XVxuICB9LFxuICBncGlvU3R1YjogZmFsc2Vcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=