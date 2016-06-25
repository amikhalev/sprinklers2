import yargs from 'yargs'

const {argv} = yargs
  .usage('Usage: $0 [-h] [-t] [-p PORT]')
  .help('h')
  .alias('h', 'help')
  .boolean('test-data')
  .alias('t', 'test-data')
  .describe('test-data', 'Initializes the SQL database with test data')
  .alias('l', 'log-level')
  .describe('log-level', 'The minimum log level to log (eg. trace, debug, info)');

export default argv;