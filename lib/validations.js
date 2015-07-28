import Joi from 'joi';

export const runSection = {
  body: {
    time: Joi.number().positive().required()
  }
};
