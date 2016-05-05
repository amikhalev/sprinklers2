import {sequelize, Section, Program, ProgramSection} from '../models/index';
import testData from './test-data.json';
import Promise from 'bluebird';

export function createTestData() {
  return sequelize.dropAllSchemas()
    .then(() => sequelize.sync())
    .then(() => Section.bulkCreate(testData.Section))
    .then(() =>
      Promise.each(testData.Program, program => Program.create(program))
    );
}
