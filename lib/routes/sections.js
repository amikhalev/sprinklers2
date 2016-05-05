import Promise from 'bluebird';
import {Router} from 'express';
import validate from 'express-validation';
import * as validations from '../util/validations.js';
import {NotFound} from '../util/errors.js';
import {Section} from '../models';

let router = new Router();

function getSections() {
  return Section.findAll()
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
  Section.findById(id)
    .then(section => {
      if (!section) {
        throw new NotFound(`Section ${id}`);
      }
      req.section = section;
      next();
      return null;
    })
    .catch(next);
});

router.get('/:section', (req, res, next) => {
  req.section.data()
    .then(section => res.json({
      status: 200,
      message: `Fetched section ${section.name}`,
      data: section
    }))
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

router.post('/:section/run', validate(validations.runSection), (req, res, next) => {
  const executor = req.app.locals.executor;
  executor.scheduleSectionRun(req.section, req.body.time);
  getSections()
    .then(sections => res.json({
      status: 200,
      message: `Running section "${req.section.name}" for ${req.body.time} seconds`,
      data: sections
    }))
    .catch(next);
});

export default router;
