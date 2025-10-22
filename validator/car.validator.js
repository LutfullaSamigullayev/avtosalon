const Joi = require("joi");
const CustomErrorHandler = require("../error/custom-error-handler");

const carValidator = Joi.object({
  category_info: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Category_info noto'g'ri ObjectId formati",
      "any.required": "Category_info majburiy maydon",
    }),
  
  mator: Joi.string().trim().required().messages({
    "string.empty": "Mator bo'sh bo'lmasligi kerak",
    "any.required": "Mator majburiy maydon",
  }),
  
  tanirovka: Joi.boolean().messages({
    "boolean.base": "Tanirovka boolean qiymat bo'lishi kerak",
  }),
  
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .required()
    .messages({
      "number.base": "Year raqam bo'lishi kerak",
      "number.min": "Year 1900 dan kichik bo'lmasligi kerak",
      "number.max": `Year ${new Date().getFullYear() + 1} dan katta bo'lmasligi kerak`,
      "any.required": "Year majburiy maydon",
    }),
  
  color: Joi.string()
    .valid("qora", "oq", "kulrang", "qizil", "ko'k", "yashil", "sariq", "jigarrang", "pushti", "binafsha", "boshqa")
    .required()
    .messages({
      "any.only": "Color qiymati noto'g'ri. Ruxsat etilgan ranglar: qora, oq, kulrang, qizil, ko'k, yashil, sariq, jigarrang, pushti, binafsha, boshqa",
      "any.required": "Color majburiy maydon",
    }),
  
  distance: Joi.number().min(0).required().messages({
    "number.base": "Distance raqam bo'lishi kerak",
    "number.min": "Distance manfiy bo'lmasligi kerak",
    "any.required": "Distance majburiy maydon",
  }),
  
  gearbook: Joi.string()
    .valid("mexanika", "avtomat", "robot", "variator")
    .required()
    .messages({
      "any.only": "Gearbook qiymati noto'g'ri. Ruxsat etilgan qiymatlar: mexanika, avtomat, robot, variator",
      "any.required": "Gearbook majburiy maydon",
    }),
  
  price: Joi.number().min(0).required().messages({
    "number.base": "Price raqam bo'lishi kerak",
    "number.min": "Price manfiy bo'lmasligi kerak",
    "any.required": "Price majburiy maydon",
  }),
  
  description: Joi.string().min(10).max(2000).trim().required().messages({
    "string.base": "Description matn bo'lishi kerak",
    "string.min": "Description kamida 10 belgidan iborat bo'lishi kerak",
    "string.max": "Description ko'pi bilan 2000 belgidan iborat bo'lishi kerak",
    "string.empty": "Description bo'sh bo'lmasligi kerak",
    "any.required": "Description majburiy maydon",
  }),
});

const carValidatorMiddleware = (req, res, next) => {
  const { error } = carValidator.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return next(CustomErrorHandler.BadRequest("Validatsiya xatosi", errors));
  }
  
  next();
};

module.exports = carValidatorMiddleware;
