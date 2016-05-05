import bunyan from 'bunyan';
import {defaultsDeep} from 'lodash';

import config from '../config';

export default function (name, conf) {
  conf = defaultsDeep(conf || {}, config.bunyan);
  conf.name = name || 'app';
  return bunyan.createLogger(conf);
}
