const CustomErrorHandler = require("../error/custom-error-handler");
const carValidator = require("../validator/car.validator");

const carValidatorMiddleware = (req, res, next) => {
  try {
    const { error } = carValidator(req.body);

    if (error) {
      const errors = error.details.map((item) => item.message);
      throw CustomErrorHandler.BadRequest("ValidationError", errors);
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = carValidatorMiddleware;
