'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libConfig = require('./lib/config');

var _libConfig2 = _interopRequireDefault(_libConfig);

var _libModels = require('./lib/models');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressBunyanLogger = require('express-bunyan-logger');

var _expressBunyanLogger2 = _interopRequireDefault(_expressBunyanLogger);

var _libAuth = require('./lib/auth');

var _libAuth2 = _interopRequireDefault(_libAuth);

var _libErrors = require('./lib/errors');

var log = require('./lib/log')();

log.debug({ config: _libConfig2['default'] }, 'config');

_bluebird2['default'].all([_libModels.Section.list(), _libModels.Program.list()]).spread(function (sections, programs) {
  log.debug({ sections: sections }, 'sections');
  log.debug({ programs: programs }, 'programs');
  log.info('Initializing sections');
  return _bluebird2['default'].each(sections, function (section) {
    return section.initialize();
  }).then(function () {
    log.info('Finished initializing sections');

    process.on('SIGINT', function () {
      log.info('Cleaning up');
      return _bluebird2['default'].each(sections, function (section) {
        return section.deinitialize();
      }).then(function () {
        log.info('Finished cleaning up');
        /*eslint no-process-exit: 0*/
        process.exit(2);
      });
    });

    process.on('exit', function (code) {
      log.info({ code: code }, 'Exiting...');
    });
  });
});

var app = (0, _express2['default'])();

app.use((0, _expressBunyanLogger2['default'])(_libConfig2['default'].server.logger));
app.use(_bodyParser2['default'].urlencoded({ extended: false }));
app.use(_bodyParser2['default'].json());
app.use(_express2['default']['static'](_path2['default'].join(__dirname, 'public')));

app.use('/', (0, _libAuth2['default'])());
app.use('/api', (0, _libAuth2['default'])());

app.use('/api/sections', require('./lib/routes/sections'));
app.use('/api/programs', require('./lib/routes/programs'));
app.use('/api/sse', require('./lib/routes/sse').route);

app.use(_libErrors.validationErrorHandler);
app.use(_libErrors.syntaxErrorHandler);
app.use(_libErrors.HttpError.handler);

var PORT = process.env.PORT || _libConfig2['default'].server.port;
var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  log.info({ address: server.address() }, 'Sprinklers server listening at http://' + host + ':' + port);
});

exports['default'] = app;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QyxDQUFDLENBQUM7QUFDM0QsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXZELEdBQUcsQ0FBQyxHQUFHLFlBZFksc0JBQXNCLENBY1YsQ0FBQztBQUNoQyxHQUFHLENBQUMsR0FBRyxZQWZvQyxrQkFBa0IsQ0FlbEMsQ0FBQztBQUM1QixHQUFHLENBQUMsR0FBRyxDQUFDLFdBaEJBLFNBQVMsQ0FnQkMsT0FBTyxDQUFDLENBQUM7O0FBRTNCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLHVCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDbEQsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsWUFBTTtBQUNsQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBQ3RDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUM7QUFDbkMsS0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUMsNkNBQTJDLElBQUksU0FBSSxJQUFJLENBQUcsQ0FBQztDQUNoRyxDQUFDLENBQUM7O3FCQUVZLEdBQUciLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgbG9nID0gcmVxdWlyZSgnLi9saWIvbG9nJykoKTtcblxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2xpYi9jb25maWcnO1xubG9nLmRlYnVnKHtjb25maWd9LCAnY29uZmlnJyk7XG5cbmltcG9ydCB7U2VjdGlvbiwgUHJvZ3JhbX0gZnJvbSAnLi9saWIvbW9kZWxzJztcblxuUHJvbWlzZS5hbGwoW1NlY3Rpb24ubGlzdCgpLCBQcm9ncmFtLmxpc3QoKV0pXG4gIC5zcHJlYWQoKHNlY3Rpb25zLCBwcm9ncmFtcykgPT4ge1xuICAgIGxvZy5kZWJ1Zyh7c2VjdGlvbnN9LCAnc2VjdGlvbnMnKTtcbiAgICBsb2cuZGVidWcoe3Byb2dyYW1zfSwgJ3Byb2dyYW1zJyk7XG4gICAgbG9nLmluZm8oJ0luaXRpYWxpemluZyBzZWN0aW9ucycpO1xuICAgIHJldHVybiBQcm9taXNlLmVhY2goc2VjdGlvbnMsIHNlY3Rpb24gPT4gc2VjdGlvbi5pbml0aWFsaXplKCkpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGxvZy5pbmZvKCdGaW5pc2hlZCBpbml0aWFsaXppbmcgc2VjdGlvbnMnKTtcblxuICAgICAgICBwcm9jZXNzLm9uKCdTSUdJTlQnLCAoKSA9PiB7XG4gICAgICAgICAgbG9nLmluZm8oJ0NsZWFuaW5nIHVwJyk7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UuZWFjaChzZWN0aW9ucywgc2VjdGlvbiA9PiBzZWN0aW9uLmRlaW5pdGlhbGl6ZSgpKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICBsb2cuaW5mbygnRmluaXNoZWQgY2xlYW5pbmcgdXAnKTtcbiAgICAgICAgICAgICAgLyplc2xpbnQgbm8tcHJvY2Vzcy1leGl0OiAwKi9cbiAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHByb2Nlc3Mub24oJ2V4aXQnLCAoY29kZSkgPT4ge1xuICAgICAgICAgIGxvZy5pbmZvKHtjb2RlfSwgJ0V4aXRpbmcuLi4nKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfSk7XG5cbmxldCBhcHAgPSBleHByZXNzKCk7XG5cbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJztcbmltcG9ydCBleHByZXNzQnVueWFuIGZyb20gJ2V4cHJlc3MtYnVueWFuLWxvZ2dlcic7XG5pbXBvcnQgYXV0aCBmcm9tICcuL2xpYi9hdXRoJztcbmltcG9ydCB7SHR0cEVycm9yLCB2YWxpZGF0aW9uRXJyb3JIYW5kbGVyLCBzeW50YXhFcnJvckhhbmRsZXJ9IGZyb20gJy4vbGliL2Vycm9ycyc7XG5cbmFwcC51c2UoZXhwcmVzc0J1bnlhbihjb25maWcuc2VydmVyLmxvZ2dlcikpO1xuYXBwLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogZmFsc2UgfSkpO1xuYXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSk7XG5hcHAudXNlKGV4cHJlc3Muc3RhdGljKHBhdGguam9pbihfX2Rpcm5hbWUsICdwdWJsaWMnKSkpO1xuXG5hcHAudXNlKCcvJywgYXV0aCgpKTtcbmFwcC51c2UoJy9hcGknLCBhdXRoKCkpO1xuXG5hcHAudXNlKCcvYXBpL3NlY3Rpb25zJywgcmVxdWlyZSgnLi9saWIvcm91dGVzL3NlY3Rpb25zJykpO1xuYXBwLnVzZSgnL2FwaS9wcm9ncmFtcycsIHJlcXVpcmUoJy4vbGliL3JvdXRlcy9wcm9ncmFtcycpKTtcbmFwcC51c2UoJy9hcGkvc3NlJywgcmVxdWlyZSgnLi9saWIvcm91dGVzL3NzZScpLnJvdXRlKTtcblxuYXBwLnVzZSh2YWxpZGF0aW9uRXJyb3JIYW5kbGVyKTtcbmFwcC51c2Uoc3ludGF4RXJyb3JIYW5kbGVyKTtcbmFwcC51c2UoSHR0cEVycm9yLmhhbmRsZXIpO1xuXG52YXIgUE9SVCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgY29uZmlnLnNlcnZlci5wb3J0O1xudmFyIHNlcnZlciA9IGFwcC5saXN0ZW4oUE9SVCwgKCkgPT4ge1xuICBjb25zdCBob3N0ID0gc2VydmVyLmFkZHJlc3MoKS5hZGRyZXNzO1xuICBjb25zdCBwb3J0ID0gc2VydmVyLmFkZHJlc3MoKS5wb3J0O1xuICBsb2cuaW5mbyh7YWRkcmVzczogc2VydmVyLmFkZHJlc3MoKX0sIGBTcHJpbmtsZXJzIHNlcnZlciBsaXN0ZW5pbmcgYXQgaHR0cDovLyR7aG9zdH06JHtwb3J0fWApO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGFwcDtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==