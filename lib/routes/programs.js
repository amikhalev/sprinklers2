import {Router} from 'express';
import {HttpError} from '../errors.js';
import Program from '../models/program.js';

let router = new Router();

function getPrograms() {
  return Program.list()
    .map(program => program.data());
}

router.get('/', (req, res) => {
  getPrograms()
    .then(programs => res.json({
      status: 200,
      message: 'Listed programs',
      data: programs
    }));
});

router.param('program', (req, res, next, id) => {
  Program.list()
    .then(programs => {
      let program = programs[id];
      if (!program) {
        return next(new HttpError(`Program ${id} not found`, 404));
      }
      req.program = program;
      next();
    })
    .catch(next);
});

router.post('/:program/run', (req, res) => {
  req.program.execute();
  getPrograms()
    .then(programs => res.json({
      status: 200,
      message: `Running program "${req.program.name}"`,
      data: programs
    }));
});

export default router;
