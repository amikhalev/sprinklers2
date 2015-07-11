import {Router} from 'express';
import Program from '../models/program.js';

let router = new Router();

router.get('/', (req, res) => {
  Program.list()
    .map(program => program.data())
    .then(programs => res.send(programs));
});

router.post('/:id/run', (req, res) => {
  Program.list()
    .then(programs => {
      let program = programs[req.params.id];
      program.execute();
      res.status(200).end();
    });
});

export default router;
