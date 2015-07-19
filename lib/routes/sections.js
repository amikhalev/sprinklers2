import Promise from 'bluebird';
import {Router} from 'express';
import {HttpError} from '../errors.js';
import Section from '../models/section.js';

let router = new Router();

function getSections() {
  return Section.list()
    .map(section => section.data());
}

router.get('/', (req, res, next) => {
  getSections()
    .then(sections => res.json({
      status: 200,
      message: 'Listed sections',
      data: sections
    }))
    .catch(next);
});

router.param('section', (req, res, next, id) => {
  Section.list()
    .then(sections => {
      let section = sections[id];
      if (!section) {
        return next(new HttpError(`Section ${id} not found`, 404));
      }
      req.section = section;
      next();
    })
    .catch(next);
});

router.put('/:section', (req, res, next) => {
  let value = req.body.value;
  let props = {};
  if (typeof value === 'boolean') {
    props.value = req.section.setValue(value);
  }
  Promise.props(props)
    .then(getSections)
    .then(sections => res.json({
      status: 200,
      message: `Updated section "${req.section.name}"`,
      data: sections
    }))
    .catch(next);
});

router.post('/:section/toggle', (req, res, next) => {
  req.section.getValue()
    .then(value => req.section.setValue(!value))
    .then(getSections)
    .then(sections => res.json({
      status: 200,
      message: `Toggled section "${req.section.name}"`,
      data: sections
    }))
    .catch(next);
});

router.post('/:section/run', (req, res, next) => {
  const time = parseFloat(req.body.time);
  if (isNaN(time) || time < 0) {
    return next(new HttpError(`time (${req.body.time}) is not a positive number`, 400));
  }
  req.section.runFor(time);
  getSections()
    .then(sections => res.json({
      status: 200,
      message: `Running section "${req.section.name}" for ${time} seconds`,
      data: sections
    }))
    .catch(next);
});

export default router;
