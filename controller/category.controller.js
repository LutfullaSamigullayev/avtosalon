const Category = require("../schema/category.schema");
const Car = require("../schema/car.schema");
const CustomErrorHandler = require("../error/custom-error-handler");
const { infoLogger } = require("../config/app-logger");
const fs = require("fs");
const path = require("path");

// Create - faqat admin
const create = async (req, res, next) => {
  try {
    const { title } = req.body;

    // Rasm yuklanganligini tekshirish
    if (!req.file) {
      throw CustomErrorHandler.BadRequest("Rasm yuklanishi shart");
    }

    const imgUrl = `/images/${req.file.filename}`;

    const category = new Category({
      title,
      imgUrl,
    });

    await category.save();

    infoLogger.info("Category created", {
      categoryId: category._id,
      title: category.title,
      createdBy: req.user._id,
      username: req.user.username,
    });

    res.status(201).json({
      message: "Category muvaffaqiyatli yaratildi",
      data: category,
    });
  } catch (error) {
    // Agar xatolik bo'lsa, yuklangan rasmni o'chirish
    if (req.file) {
      const filePath = path.join(__dirname, "../upload/images", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

// Read all - barcha userlar ko'ra oladi
const getAll = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Barcha categoriyalar",
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Read one by ID - barcha userlar ko'ra oladi
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      throw CustomErrorHandler.NotFound("Category topilmadi");
    }

    res.status(200).json({
      message: "Category topildi",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Update - faqat admin
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      // Agar yangi rasm yuklangan bo'lsa, uni o'chirish
      if (req.file) {
        const filePath = path.join(__dirname, "../upload/images", req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      throw CustomErrorHandler.NotFound("Category topilmadi");
    }

    // Agar yangi rasm yuklangan bo'lsa
    if (req.file) {
      // Eski rasmni o'chirish
      const oldImagePath = path.join(__dirname, "..", category.imgUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      category.imgUrl = `/images/${req.file.filename}`;
    }

    if (title) {
      category.title = title;
    }

    await category.save();

    infoLogger.info("Category updated", {
      categoryId: category._id,
      updatedBy: req.user._id,
      username: req.user.username,
    });

    res.status(200).json({
      message: "Category muvaffaqiyatli yangilandi",
      data: category,
    });
  } catch (error) {
    // Agar xatolik bo'lsa va yangi rasm yuklangan bo'lsa, uni o'chirish
    if (req.file) {
      const filePath = path.join(__dirname, "../upload/images", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

// Delete - faqat admin (cascade delete - tegishli mashinalar ham o'chiriladi)
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      throw CustomErrorHandler.NotFound("Category topilmadi");
    }

    // Rasmni o'chirish
    const imagePath = path.join(__dirname, "..", category.imgUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Tegishli mashinalarni topish va ularning rasmlarini o'chirish
    const cars = await Car.find({ category_info: id });
    for (const car of cars) {
      // Har bir mashina rasmlarini o'chirish
      for (const imgUrl of car.imgUrl) {
        const carImagePath = path.join(__dirname, "..", imgUrl);
        if (fs.existsSync(carImagePath)) {
          fs.unlinkSync(carImagePath);
        }
      }
    }

    // Tegishli mashinalarni o'chirish
    await Car.deleteMany({ category_info: id });

    // Categoryni o'chirish
    await Category.findByIdAndDelete(id);

    infoLogger.info("Category deleted with cascade", {
      categoryId: id,
      deletedCarsCount: cars.length,
      deletedBy: req.user._id,
      username: req.user.username,
    });

    res.status(200).json({
      message: "Category va unga tegishli mashinalar muvaffaqiyatli o'chirildi",
      deletedCarsCount: cars.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteCategory,
};
