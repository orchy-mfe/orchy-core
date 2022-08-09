import Joi from 'joi';

export const configurationSchema = Joi.object({
  CONFIGURATION_FOLDER: Joi.string().required(),
});

export const configurationLoader = () => ({
  CONFIGURATION_FOLDER: process.env.CONFIGURATION_FOLDER,
});
