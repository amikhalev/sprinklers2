import Joi from 'joi';

const time = Joi.number().min(0).max(21600).required();

export const runSection = {
  body: {
    time: time // Max of 6 hours
  }
};

export const updateProgram = {
  body: Joi.object({
    enabled: Joi.bool(),
    name: Joi.string(),
    when: Joi.string(),
    times: Joi.array().items(Joi.object({
      section: Joi.number(),
      time
    }))
  }).unknown(false)
};
