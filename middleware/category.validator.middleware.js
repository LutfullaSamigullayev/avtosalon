const CustomErrorHandler = require("../error/custom-error-handler");
const categoryValidator = require("../validator/category.validator");

const categoryValidatorMiddleware = (req, res, next) => {
  try {
    const { error } = categoryValidator(req.body);

    if (error) {
      const errors = error.details.map((item) => item.message);
      throw CustomErrorHandler.BadRequest("ValidationError", errors);
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = categoryValidatorMiddleware;
