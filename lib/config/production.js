module.exports = {
  bunyan: {
    streams: [{
      stream: process.stdout
    }, {
      type: 'rotating-file',
      level: 'debug',
      path: 'logs/app.log',
      period: '1d',
      count: 7 // keep 7 days of logs
    }]
  },
  gpioStub: true
};