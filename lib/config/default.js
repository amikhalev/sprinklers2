const env = process.env;

export default {
  server: {
    port: 8080,
    logger: {
      name: 'http',
      format: ':remote-address :incoming :method :url HTTP/:http-version :status-code' +
      ' :res-headers[content-length] :referer :user-agent[family] :user-agent[major].:user-agent[minor] :user-agent[os]' +
      ' :response-time ms',
      excludes: ['user-agent', 'response-hrtime', 'req-headers', 'res-headers', 'req', 'res']
    }
  },
  bunyan: {
    name: 'app',
    level: env.LOG_LEVEL || 'info'
  },
  testData: true};
