import _ from 'lodash';
import path from 'path';

const defaults = require('./config/default');

require('dotenv').load();
const env = process.env.NODE_ENV || 'development';

export default _.assign(defaults, require(path.join(__dirname, 'config', env)));
