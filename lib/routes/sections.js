import {Router} from 'express';
import Section from '../models/section.js';

let router = new Router();

function getSections() {
  return Section.list()
    .map(section => section.getValue()
      .then(value => {
        let data = section.data();
        data.value = value;
        return data;
      })
  );
}

router.get('/', (req, res) => {
  getSections().then(sections => res.send(sections));
});

router.put('/:id', (req, res) => {
  let value = req.body.value;
  if (typeof value !== 'boolean') {
    return res.status(400).end('value must be boolean');
  }
  Section.list()
    .then(sections => {
      let section = sections[req.params.id];
      if (!section) {
        return res.status(400).end('Invalid section number');
      }
      return section.setValue(value);
    })
    .then(() => getSections())
    .then(sections => res.send(sections))
    .catch(err => res.status(500).send(err));
});

router.post('/:id/run', (req, res) => {
  const time = parseFloat(req.body.time);
  if (isNaN(time)) {
    return res.status(400).end('Invalid time');
  }
  Section.list()
    .then(sections => {
      let section = sections[req.params.id];
      if (!section) {
        return res.status(400).end('Invalid section number');
      }
      section.runFor(time);
      res.status(200).end();
    });
});

export default router;
