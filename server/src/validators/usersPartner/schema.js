const Joi = require("joi");

const UsersPartnerPayloadSchema = Joi.object({
  username: Joi.string().required(),
  fullname: Joi.string().required(),
  password: Joi.string().required(),
});

const UsersPartnerUpdatePayloadSchema = Joi.object({
  age: Joi.number().required(),
  fullname: Joi.string().required(),
  address: Joi.string().required(),
  biodata: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  experience: Joi.string().required(),
  // specialist: Joi.string().required(),
  // ratePerHour: Joi.number().required(),
  photoUrl: Joi.string(),
});

module.exports = { UsersPartnerPayloadSchema, UsersPartnerUpdatePayloadSchema };
