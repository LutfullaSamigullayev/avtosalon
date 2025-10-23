const { Router } = require("express");
const {
  create,
  getAll,
  getMyCars,
  getByCategory,
  getById,
  update,
  delete: deleteCar,
} = require("../controller/car.controller");
const carValidatorMiddleware = require("../middleware/car.validator.middleware");
const { uploadMultipleImages } = require("../middleware/image-upload.middleware");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const adminCheckerMiddleware = require("../middleware/admin-super_admin.chesker.middleware");
const objectIdValidatorMiddleware = require("../middleware/objectId.validator.middleware");

const router = Router();

// Public routes - barcha userlar uchun
router.get("/car", getAll);
router.get("/car/by-category/:categoryId", objectIdValidatorMiddleware, getByCategory);

// Protected routes - faqat admin uchun
// Admin o'z carlarini ko'rish (/:id dan oldin bo'lishi kerak)
router.get("/car/my-cars", authorizationMiddleware, adminCheckerMiddleware, getMyCars);

// Public route - bitta car
router.get("/car/:id", objectIdValidatorMiddleware, getById);

router.post(
  "/car",
  authorizationMiddleware,
  adminCheckerMiddleware,
  uploadMultipleImages,
  carValidatorMiddleware,
  create
);

router.put(
  "/car/:id",
  authorizationMiddleware,
  adminCheckerMiddleware,
  objectIdValidatorMiddleware,
  uploadMultipleImages,
  carValidatorMiddleware,
  update
);

router.delete(
  "/car/:id",
  authorizationMiddleware,
  adminCheckerMiddleware,
  objectIdValidatorMiddleware,
  deleteCar
);

module.exports = router;
