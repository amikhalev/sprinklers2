import sequelize from './sequelize';
import Section from './Section';
import Program from './Program';
import ProgramSection from './ProgramSection';

export {sequelize, Section, Program, ProgramSection};

[Section, Program, ProgramSection].forEach(model => {
  if (model.associate && typeof model.associate === 'function') {
    model.associate(sequelize.models);
  }
});