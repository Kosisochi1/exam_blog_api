const joi = require("joi");
const logger = require("../logger/index");
const { schema } = require("../model/userModel");

const validatUser = async (req, res, next) => {
  try {
    logger.info("[Validate] => Check if all user variables are valid");
    const schema = joi.object({
      first_name: joi.string().required(),
      last_name: joi.string().required(),
      email: joi.string().email(),
      password: joi.string().required(),
    });
    await schema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (error) {
    return res.status(400).json({
      massage: "FIll in correct  details",
    });
  }
};
const validateLoginUser = async (req, res, next) => {
  try {
    const schema = joi.object({
      email: joi.string().required(),
      password: joi.string().required(),
    });
    await schema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (error) {
    return res.status(400).json({
      massage: "check password",
    });
  }
};

module.exports = {
  validatUser,
  validateLoginUser,
};
