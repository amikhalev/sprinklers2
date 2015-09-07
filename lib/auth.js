//import auth from 'basic-auth';
//let users = require('./test-data.json').users;

export default function () {
  return (req, res, next) => {
    //function unauthorized() {
    //  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    //  return res.send(401);
    //}
    //var authUser = auth(req);
    //if (!authUser || !authUser.name || !authUser.pass) {
    //  return unauthorized();
    //}
    //if (users.some(user => (user.name === authUser.name) && (user.password === authUser.pass))) {
    //  return next();
    //} else {
    //  return unauthorized();
    //}
    next();
  };
}
