import Joi from 'joi';

export const runSection = {
  body: {
    time: Joi.number().min(0).required()
  }
};
