import {assign} from 'lodash';
import {join} from 'path';

const defaults = require('./default');

require('dotenv').load();
const env = process.env.NODE_ENV || 'development';

export default assign(defaults, require(join(__dirname, env)));
