import { celebrate } from "celebrate";
import Joi from "joi";

export const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(8).max(4096),
  }),
});
