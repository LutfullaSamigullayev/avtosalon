const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category.controller");
const categoryValidator = require("../validator/category.validator");
const { uploadSingleImage } = require("../middleware/image-upload.middleware");
const authorization = require("../middleware/authorization.middleware");
const adminChecker = require("../middleware/admin-super_admin.chesker.middleware");
const objectIdValidator = require("../middleware/objectId.validator.middleware");

// Public routes - barcha userlar uchun
router.get("/", categoryController.getAll);
router.get("/:id", objectIdValidator, categoryController.getById);

// Protected routes - faqat admin uchun
router.post(
  "/",
  authorization,
  adminChecker,
  uploadSingleImage,
  categoryValidator,
  categoryController.create
);

router.put(
  "/:id",
  authorization,
  adminChecker,
  objectIdValidator,
  uploadSingleImage,
  categoryValidator,
  categoryController.update
);

router.delete(
  "/:id",
  authorization,
  adminChecker,
  objectIdValidator,
  categoryController.delete
);

module.exports = router;
