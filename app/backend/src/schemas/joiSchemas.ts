import Joi = require('joi');

export default class JoiSchemas {
  user = Joi.object().keys({
    username: Joi.string().min(8),
    role: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required().messages({
      'string.min': '"password" length must be 6 characters long',
    }),
  });

  login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
}
