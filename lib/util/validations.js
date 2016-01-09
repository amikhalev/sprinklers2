import Joi from 'joi';

export const runSection = {
  body: {
    time: Joi.number().min(0).max(21600).required() // Max of 6 hours
  }
};
