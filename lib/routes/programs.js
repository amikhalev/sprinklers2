import {Router} from 'express';
import {HttpError} from '../errors.js';
import {Program} from '../models';

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
        throw new HttpError(`Program ${id} not found`, 404, 'NotFound');
      }
      req.program = program;
      next();
    })
    .catch(next);
});

router.get('/:program', (req, res) => {
  res.json({
    status: 200,
    message: `Fetched program ${req.program.name}`,
    data: req.program.data()
  });
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
