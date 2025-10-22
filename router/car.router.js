const express = require("express");
const router = express.Router();
const carController = require("../controller/car.controller");
const carValidator = require("../validator/car.validator");
const { uploadMultipleImages } = require("../middleware/image-upload.middleware");
const authorization = require("../middleware/authorization.middleware");
const adminChecker = require("../middleware/admin-super_admin.chesker.middleware");
const objectIdValidator = require("../middleware/objectId.validator.middleware");

// Public routes - barcha userlar uchun
router.get("/", carController.getAll);
router.get("/by-category/:categoryId", objectIdValidator, carController.getByCategory);

// Protected routes - faqat admin uchun
// Admin o'z carlarini ko'rish (/:id dan oldin bo'lishi kerak)
router.get("/my-cars", authorization, adminChecker, carController.getMyCars);

// Public route - bitta car
router.get("/:id", objectIdValidator, carController.getById);
router.post(
  "/",
  authorization,
  adminChecker,
  uploadMultipleImages,
  carValidator,
  carController.create
);

router.put(
  "/:id",
  authorization,
  adminChecker,
  objectIdValidator,
  uploadMultipleImages,
  carValidator,
  carController.update
);

router.delete(
  "/:id",
  authorization,
  adminChecker,
  objectIdValidator,
  carController.delete
);

module.exports = router;
