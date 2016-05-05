import {Router} from 'express';
import Promise from 'bluebird';
import {NotFound, BadRequest} from '../util/errors.js';
import {Program, ProgramSection, Section} from '../models/index';
import validate from 'express-validation';
import * as validations from '../util/validations.js';

let router = new Router();

function getPrograms() {
  return Program.findAll()
    .map(program => program.data());
}

router.get('/', (req, res, next) => {
  return getPrograms()
    .then(programs => res.json({
      status: 200,
      message: 'Listed programs',
      data: programs
    }))
    .catch(next);
});

router.param('program', (req, res, next, id) => {
  Program.findById(id)
    .then(program => {
      if (!program) {
        throw new NotFound(`Program ${id}`);
      }
      req.program = program;
      next();
      return null;
    })
    .catch(next);
});

router.get('/:program', (req, res) => {
  req.program.data()
    .then(program =>res.json({
      status: 200,
      message: `Fetched program ${program.name}`,
      data: [ program ]
    }))
    .catch(next);
});

router.put('/:program', (req, res, next) => {
  const executor = req.app.locals.executor;
  let promise;
  //if (typeof req.body === 'object' && req.body.times) {
  //  let times = req.body.times;
  //  if (!Array.isArray(times)) {
  //    throw new BadRequest('Program times must be an array');
  //  }
  //  times.forEach(time => {
  //    time.programId = req.program.id; // force id to match
  //    delete time.section; // disallow change sections, only set sectionId
  //  });
  //  req.log.trace({ times }, 'setting times on program');
  //  promise = req.program.setTimes(times);
  //} else {
  promise = Promise.resolve();
  //}
  promise
    .then(() => req.program.set(req.body))
    .then(() => req.program.save())
    .tap(program => req.log.debug({ program }, 'Updated program data'))
    .then(program => program.data())
    .then(program => res.json({
      status: 200,
      message: `Updated program ${program.name}`,
      data: [ program ]
    }))
    .catch(next);
});

router.post('/:program/run', (req, res, next) => {
  req.app.locals.executor.runProgram(req.program);
  req.program.data()
    .then(program => res.json({
      status: 200,
      message: `Running program "${req.program.name}"`,
      data: [ program ]
    }))
    .catch(next);
});

export default router;
