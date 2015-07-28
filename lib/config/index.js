'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _path = require('path');

var defaults = require('./default');

require('dotenv').load();
var env = process.env.NODE_ENV || 'development';

exports['default'] = (0, _lodash.assign)(defaults, require((0, _path.join)(__dirname, env)));
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb25maWcvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3NCQUFxQixRQUFROztvQkFDVixNQUFNOztBQUV6QixJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXRDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN6QixJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsSUFBSSxhQUFhLENBQUM7O3FCQUVuQyxZQVJQLE1BQU0sRUFRUSxRQUFRLEVBQUUsT0FBTyxDQUFDLFVBUGhDLElBQUksRUFPaUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoibGliL2NvbmZpZy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzaWdufSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtqb2lufSBmcm9tICdwYXRoJztcblxuY29uc3QgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHQnKTtcblxucmVxdWlyZSgnZG90ZW52JykubG9hZCgpO1xuY29uc3QgZW52ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JztcblxuZXhwb3J0IGRlZmF1bHQgYXNzaWduKGRlZmF1bHRzLCByZXF1aXJlKGpvaW4oX19kaXJuYW1lLCBlbnYpKSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=