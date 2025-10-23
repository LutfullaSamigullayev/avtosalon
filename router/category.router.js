const { Router } = require("express");
const {
  create,
  getAll,
  getById,
  update,
  delete: deleteCategory,
} = require("../controller/category.controller");
const categoryValidatorMiddleware = require("../middleware/category.validator.middleware");
const { uploadSingleImage } = require("../middleware/image-upload.middleware");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const adminCheckerMiddleware = require("../middleware/admin-super_admin.chesker.middleware");
const superAdminCheckerMiddleware = require("../middleware/super_admin.chesker.middleware");
const objectIdValidatorMiddleware = require("../middleware/objectId.validator.middleware");

const router = Router();

// Public routes - barcha userlar uchun
router.get("/category", getAll);
router.get("/category/:id", objectIdValidatorMiddleware, getById);

// Protected routes - faqat admin uchun
router.post(
  "/category",
  authorizationMiddleware,
  adminCheckerMiddleware,
  uploadSingleImage,
  categoryValidatorMiddleware,
  create
);

// Update va Delete - faqat super_admin
router.put(
  "/category/:id",
  authorizationMiddleware,
  superAdminCheckerMiddleware,
  objectIdValidatorMiddleware,
  uploadSingleImage,
  categoryValidatorMiddleware,
  update
);

router.delete(
  "/category/:id",
  authorizationMiddleware,
  superAdminCheckerMiddleware,
  objectIdValidatorMiddleware,
  deleteCategory
);

module.exports = router;
