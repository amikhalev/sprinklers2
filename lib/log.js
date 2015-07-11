import bunyan from 'bunyan';
import _ from 'lodash';

import config from './config';

export default function (name, conf) {
  conf = _.defaultsDeep(conf || {}, config.bunyan);
  conf.name = name || 'app';
  return bunyan.createLogger(conf);
}
