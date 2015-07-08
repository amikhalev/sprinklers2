var PrettyStream = require('bunyan-prettystream');
var pretty = new PrettyStream();
pretty.pipe(process.stdout);

module.exports = {
  bunyan: {
    streams: [{
      stream: pretty
    }]
  },
  gpioStub: true
};