const winston = require("winston");
const path = require("path");
require("winston-mongodb");

// Error loglar uchun format
const errorFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Warning loglar uchun format
const warningFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.json()
);

// Error logger - faqat errorlarni yozadi
const errorLogger = winston.createLogger({
  level: "error",
  format: errorFormat,
  transports: [
    // Console'ga chiqarish
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Faylga saqlash
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // MongoDB'ga saqlash
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      collection: "error_logs",
      options: { useUnifiedTopology: true },
      level: "error",
      tryReconnect: true,
      expireAfterSeconds: 60 * 60 * 24 * 90, // 90 kun
    }),
  ],
});

// Warning logger - faqat warninglarni yozadi
const warningLogger = winston.createLogger({
  level: "warn",
  format: warningFormat,
  transports: [
    // Console'ga chiqarish
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Faylga saqlash
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/warning.log"),
      level: "warn",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // MongoDB'ga saqlash
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      collection: "warning_logs",
      options: { useUnifiedTopology: true },
      level: "warn",
      tryReconnect: true,
      expireAfterSeconds: 60 * 60 * 24 * 60, // 60 kun
    }),
  ],
});

// Info logger - umumiy loglar uchun
const infoLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      collection: "app_logs",
      options: { useUnifiedTopology: true },
      level: "info",
      tryReconnect: true,
      expireAfterSeconds: 60 * 60 * 24 * 30, // 30 kun
    }),
  ],
});

module.exports = {
  errorLogger,
  warningLogger,
  infoLogger,
};
