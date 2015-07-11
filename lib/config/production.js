export default {
  bunyan: {
    streams: [{
      stream: process.stdout
    }, {
      type: 'file',
      level: 'debug',
      path: 'logs/app.log'
    }]
  },
  gpioStub: false
};
