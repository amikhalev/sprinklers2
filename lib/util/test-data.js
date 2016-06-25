import Promise from 'bluebird';
import {sequelize, Section, Program, ProgramSection} from '../models/index';
import testData from './../test-data.json';

export function createTestData() {
  return sequelize.transaction(transaction =>
    sequelize.dropAllSchemas({ transaction })
      .then(() => sequelize.sync({ transaction }))
      .then(() => Section.bulkCreate(testData.Section, { transaction }))
      .then(() =>
        Promise.each(testData.Program, program => Program.create(program, {
          include: [ {
            model: ProgramSection, as: 'times'
          } ],
          transaction
        }))
      )
  );
}
