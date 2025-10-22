const multer = require("multer");
const path = require("path");
const fs = require("fs");
const CustomErrorHandler = require("../error/custom-error-handler");

// Upload papkalarini yaratish
const uploadDir = "./upload/images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Fayl saqlash konfiguratsiyasi
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Unique fayl nomi yaratish
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Fayl filtratsiyasi - faqat rasmlar
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new CustomErrorHandler(
        400,
        "Faqat rasm fayllarini yuklash mumkin (jpeg, jpg, png, webp)"
      ),
      false
    );
  }
};

// Multer konfiguratsiyasi
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Bitta rasm yuklash (category uchun)
const uploadSingle = upload.single("image");

// Ko'p rasmlar yuklash (car uchun, max 10 ta)
const uploadMultiple = upload.array("images", 10);

// Xatoliklarni boshqarish uchun wrapper
const handleUploadError = (uploadFunction) => {
  return (req, res, next) => {
    uploadFunction(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            CustomErrorHandler.BadRequest("Fayl hajmi juda katta (max 5MB)")
          );
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return next(
            CustomErrorHandler.BadRequest("Ko'pi bilan 10 ta rasm yuklash mumkin")
          );
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return next(
            CustomErrorHandler.BadRequest("Kutilmagan fayl maydoni")
          );
        }
        return next(CustomErrorHandler.BadRequest(err.message));
      }
      
      if (err) {
        return next(err);
      }
      
      next();
    });
  };
};

module.exports = {
  uploadSingleImage: handleUploadError(uploadSingle),
  uploadMultipleImages: handleUploadError(uploadMultiple),
};
