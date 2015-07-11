const env = process.env;

export default {
  server: {
    port: 8080,
    logger: {
      name: 'http'
    }
  },
  bunyan: {
    name: 'app',
    level: env.LOG_LEVEL || 'info'
  },
  testData: true,
  runTest: false
};
