import Promise from 'bluebird';
import DataTypes from 'sequelize/lib/data-types';
import Instance from 'sequelize/lib/instance'
import sequelize from './sequelize';

import Section from './Section.js';

const ProgramSection = sequelize.define('ProgramSection', {
  time: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  programId: {
    type: DataTypes.INTEGER(11),
    allowNull: false
  },
  sectionId: {
    type: DataTypes.INTEGER(11),
    allowNull: false
  }
}, {
  classMethods: {
    associate: (models) => {
      let {Program, ProgramSection, Section} = models;
      Program.hasMany(ProgramSection, { as: 'times', foreignKey: 'programId' });
      ProgramSection.belongsTo(Program, { foreignKey: 'programId' });
      ProgramSection.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });
    }
  }
});

export default ProgramSection;