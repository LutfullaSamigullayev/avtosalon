const Joi = require("joi");

// 🔹 Category create/update uchun validator
const categoryValidator = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(100).trim().required().messages({
      "string.base": "Title matn bo'lishi kerak",
      "string.min": "Title kamida 2 belgidan iborat bo'lishi kerak",
      "string.max": "Title ko'pi bilan 100 belgidan iborat bo'lishi kerak",
      "string.empty": "Title bo'sh bo'lmasligi kerak",
      "any.required": "Title majburiy maydon",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

module.exports = categoryValidator