import {Bunyan2Loggly} from 'bunyan-loggly';
const env = process.env;

export default {
  bunyan: {
    streams: [{
      stream: process.stdout
    }, {
      type: 'file',
      level: 'debug',
      path: 'logs/app.log'
    }/*, {
      type: 'raw',
      stream: new Bunyan2Loggly({
        token: env.LOGGLY_TOKEN,
        subdomain: env.LOGGLY_SUBDOMAIN
      })
    }*/]
  },
  gpioStub: false
};
