import Joi from "@hapi/joi";

export const userRegister = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().lowercase().email().required(),
  mobile: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  password: Joi.string().min(3).required(),
});

export const userLogin = Joi.object({
  email: Joi.string().email(),
  mobile: Joi.string().pattern(new RegExp(/^\d{10}$/)),
  username: Joi.string().alphanum().min(3).max(30),
  password: Joi.string().required(),
}).xor("email", "mobile", "username");
