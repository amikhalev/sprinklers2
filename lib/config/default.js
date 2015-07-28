'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var env = process.env;

exports['default'] = {
  server: {
    port: 8080,
    logger: {
      name: 'http',
      format: ':remote-address :incoming :method :url HTTP/:http-version :status-code' + ' :res-headers[content-length] :referer :user-agent[family] :user-agent[major].:user-agent[minor] :user-agent[os]' + ' :response-time ms',
      excludes: ['user-agent', 'response-hrtime', 'req-headers', 'res-headers', 'req', 'res']
    }
  },
  bunyan: {
    name: 'app',
    level: env.LOG_LEVEL || 'info'
  },
  testData: true
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb25maWcvZGVmYXVsdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7O3FCQUVUO0FBQ2IsUUFBTSxFQUFFO0FBQ04sUUFBSSxFQUFFLElBQUk7QUFDVixVQUFNLEVBQUU7QUFDTixVQUFJLEVBQUUsTUFBTTtBQUNaLFlBQU0sRUFBRSx3RUFBd0UsR0FDaEYsa0hBQWtILEdBQ2xILG9CQUFvQjtBQUNwQixjQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO0tBQ3hGO0dBQ0Y7QUFDRCxRQUFNLEVBQUU7QUFDTixRQUFJLEVBQUUsS0FBSztBQUNYLFNBQUssRUFBRSxHQUFHLENBQUMsU0FBUyxJQUFJLE1BQU07R0FDL0I7QUFDRCxVQUFRLEVBQUUsSUFBSTtDQUNmIiwiZmlsZSI6ImxpYi9jb25maWcvZGVmYXVsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGVudiA9IHByb2Nlc3MuZW52O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDgwODAsXG4gICAgbG9nZ2VyOiB7XG4gICAgICBuYW1lOiAnaHR0cCcsXG4gICAgICBmb3JtYXQ6ICc6cmVtb3RlLWFkZHJlc3MgOmluY29taW5nIDptZXRob2QgOnVybCBIVFRQLzpodHRwLXZlcnNpb24gOnN0YXR1cy1jb2RlJyArXG4gICAgICAnIDpyZXMtaGVhZGVyc1tjb250ZW50LWxlbmd0aF0gOnJlZmVyZXIgOnVzZXItYWdlbnRbZmFtaWx5XSA6dXNlci1hZ2VudFttYWpvcl0uOnVzZXItYWdlbnRbbWlub3JdIDp1c2VyLWFnZW50W29zXScgK1xuICAgICAgJyA6cmVzcG9uc2UtdGltZSBtcycsXG4gICAgICBleGNsdWRlczogWyd1c2VyLWFnZW50JywgJ3Jlc3BvbnNlLWhydGltZScsICdyZXEtaGVhZGVycycsICdyZXMtaGVhZGVycycsICdyZXEnLCAncmVzJ11cbiAgICB9XG4gIH0sXG4gIGJ1bnlhbjoge1xuICAgIG5hbWU6ICdhcHAnLFxuICAgIGxldmVsOiBlbnYuTE9HX0xFVkVMIHx8ICdpbmZvJ1xuICB9LFxuICB0ZXN0RGF0YTogdHJ1ZVxufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==