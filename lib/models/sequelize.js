import Sequelize from 'sequelize';
import assign from 'lodash/object/assign';

import config from '../config/index';
import createLogger from '../util/createLogger';

const log = createLogger('sequelize');
const sequelizeConfig = assign(config.sequelize, {
  logging: msg => log.trace(msg)
});

const sequelize = new Sequelize(sequelizeConfig);

export default sequelize;
