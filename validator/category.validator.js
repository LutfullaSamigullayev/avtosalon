const Joi = require("joi");
const CustomErrorHandler = require("../error/custom-error-handler");

const categoryValidator = Joi.object({
  title: Joi.string().min(2).max(100).trim().required().messages({
    "string.base": "Title matn bo'lishi kerak",
    "string.min": "Title kamida 2 belgidan iborat bo'lishi kerak",
    "string.max": "Title ko'pi bilan 100 belgidan iborat bo'lishi kerak",
    "string.empty": "Title bo'sh bo'lmasligi kerak",
    "any.required": "Title majburiy maydon",
  }),
});

const categoryValidatorMiddleware = (req, res, next) => {
  const { error } = categoryValidator.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return next(CustomErrorHandler.BadRequest("Validatsiya xatosi", errors));
  }
  
  next();
};

module.exports = categoryValidatorMiddleware;
