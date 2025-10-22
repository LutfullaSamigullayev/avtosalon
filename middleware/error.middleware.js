const CustomErrorHandler = require("../error/custom-error-handler");
const { errorLogger, warningLogger } = require("../config/app-logger");

module.exports = function (err, req, res, next) {
  try {
    // Error logini yozish
    const errorLog = {
      message: err.message,
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      body: req.body,
      query: req.query,
      user: req.user ? { id: req.user._id, username: req.user.username, role: req.user.role } : null,
      timestamp: new Date().toISOString(),
    };

    if (err instanceof CustomErrorHandler) {
      // 4xx xatolar uchun warning
      if (err.status >= 400 && err.status < 500) {
        warningLogger.warn("Client error", { ...errorLog, statusCode: err.status, errors: err.errors });
      } else {
        errorLogger.error("Server error", { ...errorLog, statusCode: err.status, errors: err.errors });
      }
      
      return res
        .status(err.status)
        .json({ message: err.message, errors: err.errors });
    }
    
    if(err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(item => item.message);
      warningLogger.warn("Validation error", { ...errorLog, errors: validationErrors });
      
      return res.status(400).json({
        message: "ValidationError",
        errors: validationErrors
      });
    }
    
    if (err.name === "MongoServerError") {
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const errorMessage = `${field} qiymati allaqachon mavjud: "${value}"`;
        
        warningLogger.warn("Duplicate key error", { ...errorLog, field, value });
        
        return res.status(400).json({
          message: "Duplicate Key Error",
          errors: [errorMessage],
        });
      }

      // boshqa Mongo errorlar uchun
      errorLogger.error("Mongo server error", { ...errorLog, code: err.code });
      
      return res.status(400).json({
        message: "Mongo Server Error",
        errors: [err.message],
      });
    }
    
    // Kutilmagan xatolar uchun
    errorLogger.error("Unexpected error", errorLog);
    
    res.status(500).json({ 
      message: "Internal Server Error",
      errors: [err.message] 
    });
  } catch (error) {
    errorLogger.error("Error in error handler", {
      message: error.message,
      stack: error.stack,
    });
    
    res.status(500).json({ message: "Internal Server Error" });
  }
};
