'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _express = require('express');

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _validationsJs = require('../validations.js');

var validations = _interopRequireWildcard(_validationsJs);

var _errorsJs = require('../errors.js');

var _models = require('../models');

var router = new _express.Router();

function getSections() {
  return _models.Section.list().map(function (section) {
    return section.data();
  });
}

router.get('/', function (req, res, next) {
  getSections().then(function (sections) {
    return res.json({
      status: 200,
      message: 'Listed sections',
      data: sections
    });
  })['catch'](next);
});

router.param('section', function (req, res, next, id) {
  _models.Section.list().then(function (sections) {
    var section = sections[id];
    if (!section) {
      throw new _errorsJs.NotFound('Section ' + id);
    }
    req.section = section;
    next();
  })['catch'](next);
});

router.get('/:section', function (req, res, next) {
  req.section.data().then(function (section) {
    return res.json({
      status: 200,
      message: 'Fetched section ' + section.name,
      data: section
    });
  })['catch'](next);
});

router.put('/:section', function (req, res, next) {
  var value = req.body.value;
  var props = {};
  if (typeof value === 'boolean') {
    props.value = req.section.setValue(value);
  }
  _bluebird2['default'].props(props).then(getSections).then(function (sections) {
    return res.json({
      status: 200,
      message: 'Updated section "' + req.section.name + '"',
      data: sections
    });
  })['catch'](next);
});

router.post('/:section/toggle', function (req, res, next) {
  req.section.getValue().then(function (value) {
    return req.section.setValue(!value);
  }).then(getSections).then(function (sections) {
    return res.json({
      status: 200,
      message: 'Toggled section "' + req.section.name + '"',
      data: sections
    });
  })['catch'](next);
});

router.post('/:section/run', (0, _expressValidation2['default'])(validations.runSection), function (req, res, next) {
  req.section.runFor(req.body.time);
  getSections().then(function (sections) {
    return res.json({
      status: 200,
      message: 'Running section "' + req.section.name + '" for ' + req.body.time + ' seconds',
      data: sections
    });
  })['catch'](next);
});

exports['default'] = router;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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ImltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7Um91dGVyfSBmcm9tICdleHByZXNzJztcbmltcG9ydCB2YWxpZGF0ZSBmcm9tICdleHByZXNzLXZhbGlkYXRpb24nO1xuaW1wb3J0ICogYXMgdmFsaWRhdGlvbnMgZnJvbSAnLi4vdmFsaWRhdGlvbnMuanMnO1xuaW1wb3J0IHtOb3RGb3VuZH0gZnJvbSAnLi4vZXJyb3JzLmpzJztcbmltcG9ydCB7U2VjdGlvbn0gZnJvbSAnLi4vbW9kZWxzJztcblxubGV0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuZnVuY3Rpb24gZ2V0U2VjdGlvbnMoKSB7XG4gIHJldHVybiBTZWN0aW9uLmxpc3QoKVxuICAgIC5tYXAoc2VjdGlvbiA9PiBzZWN0aW9uLmRhdGEoKSk7XG59XG5cbnJvdXRlci5nZXQoJy8nLCAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgZ2V0U2VjdGlvbnMoKVxuICAgIC50aGVuKHNlY3Rpb25zID0+IHJlcy5qc29uKHtcbiAgICAgIHN0YXR1czogMjAwLFxuICAgICAgbWVzc2FnZTogJ0xpc3RlZCBzZWN0aW9ucycsXG4gICAgICBkYXRhOiBzZWN0aW9uc1xuICAgIH0pKVxuICAgIC5jYXRjaChuZXh0KTtcbn0pO1xuXG5yb3V0ZXIucGFyYW0oJ3NlY3Rpb24nLCAocmVxLCByZXMsIG5leHQsIGlkKSA9PiB7XG4gIFNlY3Rpb24ubGlzdCgpXG4gICAgLnRoZW4oc2VjdGlvbnMgPT4ge1xuICAgICAgbGV0IHNlY3Rpb24gPSBzZWN0aW9uc1tpZF07XG4gICAgICBpZiAoIXNlY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE5vdEZvdW5kKGBTZWN0aW9uICR7aWR9YCk7XG4gICAgICB9XG4gICAgICByZXEuc2VjdGlvbiA9IHNlY3Rpb247XG4gICAgICBuZXh0KCk7XG4gICAgfSlcbiAgICAuY2F0Y2gobmV4dCk7XG59KTtcblxucm91dGVyLmdldCgnLzpzZWN0aW9uJywgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIHJlcS5zZWN0aW9uLmRhdGEoKVxuICAgIC50aGVuKHNlY3Rpb24gPT4gcmVzLmpzb24oe1xuICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICBtZXNzYWdlOiBgRmV0Y2hlZCBzZWN0aW9uICR7c2VjdGlvbi5uYW1lfWAsXG4gICAgICBkYXRhOiBzZWN0aW9uXG4gICAgfSkpXG4gICAgLmNhdGNoKG5leHQpO1xufSk7XG5cbnJvdXRlci5wdXQoJy86c2VjdGlvbicsIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICBsZXQgdmFsdWUgPSByZXEuYm9keS52YWx1ZTtcbiAgbGV0IHByb3BzID0ge307XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykge1xuICAgIHByb3BzLnZhbHVlID0gcmVxLnNlY3Rpb24uc2V0VmFsdWUodmFsdWUpO1xuICB9XG4gIFByb21pc2UucHJvcHMocHJvcHMpXG4gICAgLnRoZW4oZ2V0U2VjdGlvbnMpXG4gICAgLnRoZW4oc2VjdGlvbnMgPT4gcmVzLmpzb24oe1xuICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICBtZXNzYWdlOiBgVXBkYXRlZCBzZWN0aW9uIFwiJHtyZXEuc2VjdGlvbi5uYW1lfVwiYCxcbiAgICAgIGRhdGE6IHNlY3Rpb25zXG4gICAgfSkpXG4gICAgLmNhdGNoKG5leHQpO1xufSk7XG5cbnJvdXRlci5wb3N0KCcvOnNlY3Rpb24vdG9nZ2xlJywgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIHJlcS5zZWN0aW9uLmdldFZhbHVlKClcbiAgICAudGhlbih2YWx1ZSA9PiByZXEuc2VjdGlvbi5zZXRWYWx1ZSghdmFsdWUpKVxuICAgIC50aGVuKGdldFNlY3Rpb25zKVxuICAgIC50aGVuKHNlY3Rpb25zID0+IHJlcy5qc29uKHtcbiAgICAgIHN0YXR1czogMjAwLFxuICAgICAgbWVzc2FnZTogYFRvZ2dsZWQgc2VjdGlvbiBcIiR7cmVxLnNlY3Rpb24ubmFtZX1cImAsXG4gICAgICBkYXRhOiBzZWN0aW9uc1xuICAgIH0pKVxuICAgIC5jYXRjaChuZXh0KTtcbn0pO1xuXG5yb3V0ZXIucG9zdCgnLzpzZWN0aW9uL3J1bicsIHZhbGlkYXRlKHZhbGlkYXRpb25zLnJ1blNlY3Rpb24pLCAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgcmVxLnNlY3Rpb24ucnVuRm9yKHJlcS5ib2R5LnRpbWUpO1xuICBnZXRTZWN0aW9ucygpXG4gICAgLnRoZW4oc2VjdGlvbnMgPT4gcmVzLmpzb24oe1xuICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICBtZXNzYWdlOiBgUnVubmluZyBzZWN0aW9uIFwiJHtyZXEuc2VjdGlvbi5uYW1lfVwiIGZvciAke3JlcS5ib2R5LnRpbWV9IHNlY29uZHNgLFxuICAgICAgZGF0YTogc2VjdGlvbnNcbiAgICB9KSlcbiAgICAuY2F0Y2gobmV4dCk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9