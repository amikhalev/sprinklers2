import Joi from 'joi';

const time = Joi.number().min(0).max(21600).required(); // Max of 6 hours

export const runSection = {
  body: {
    time: time
  }
};
