var auth = require('basic-auth');
var users = require('./test-data.json').users;

module.exports = function () {
  return function (req, res, next) {
    function unauthorized(res) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.send(401);
    }
    var authUser = auth(req);
    if (!authUser || !authUser.name || !authUser.pass) {
      return unauthorized(res);
    }
    if (users.some(function (user) {
        return (user.name === authUser.name) && (user.password === authUser.pass);
      })) {
      return next();
    } else {
      return unauthorized(res);
    }
  }
};
