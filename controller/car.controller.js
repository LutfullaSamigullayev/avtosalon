const Car = require("../schema/car.schema");
const Category = require("../schema/category.schema");
const CustomErrorHandler = require("../error/custom-error-handler");
const { infoLogger } = require("../config/app-logger");
const fs = require("fs");
const path = require("path");

const carController = {
  // Create - faqat admin
  async create(req, res, next) {
    try {
      const { category_info, mator, tanirovka, year, color, distance, gearbook, price, description } = req.body;

      // Rasmlar yuklanganligini tekshirish
      if (!req.files || req.files.length === 0) {
        throw CustomErrorHandler.BadRequest("Kamida 1 ta rasm yuklash shart");
      }

      // Category mavjudligini tekshirish
      const category = await Category.findById(category_info);
      if (!category) {
        // Yuklangan rasmlarni o'chirish
        req.files.forEach((file) => {
          const filePath = path.join(__dirname, "../upload/images", file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
        throw CustomErrorHandler.NotFound("Category topilmadi");
      }

      // Rasm URL'larini yaratish
      const imgUrl = req.files.map((file) => `/images/${file.filename}`);

      const car = new Car({
        category_info,
        mator,
        tanirovka: tanirovka === "true" || tanirovka === true,
        year,
        color,
        distance,
        gearbook,
        price,
        imgUrl,
        description,
        addedBy: req.user._id,
      });

      await car.save();

      infoLogger.info("Car created", {
        carId: car._id,
        categoryId: category_info,
        createdBy: req.user._id,
        username: req.user.username,
      });

      res.status(201).json({
        message: "Mashina muvaffaqiyatli yaratildi",
        data: car,
      });
    } catch (error) {
      // Agar xatolik bo'lsa, yuklangan rasmlarni o'chirish
      if (req.files) {
        req.files.forEach((file) => {
          const filePath = path.join(__dirname, "../upload/images", file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      next(error);
    }
  },

  // Read all - barcha userlar ko'ra oladi
  async getAll(req, res, next) {
    try {
      const cars = await Car.find()
        .populate("category_info", "title imgUrl")
        .populate("addedBy", "username email")
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: "Barcha mashinalar",
        count: cars.length,
        data: cars,
      });
    } catch (error) {
      next(error);
    }
  },

  // Read by category with pagination - barcha userlar ko'ra oladi
  async getByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Category mavjudligini tekshirish
      const category = await Category.findById(categoryId);
      if (!category) {
        throw CustomErrorHandler.NotFound("Category topilmadi");
      }

      const cars = await Car.find({ category_info: categoryId })
        .populate("category_info", "title imgUrl")
        .populate("addedBy", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalCars = await Car.countDocuments({ category_info: categoryId });
      const totalPages = Math.ceil(totalCars / limit);

      res.status(200).json({
        message: "Categoriya bo'yicha mashinalar",
        category: category.title,
        pagination: {
          currentPage: page,
          totalPages,
          totalCars,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        data: cars,
      });
    } catch (error) {
      next(error);
    }
  },

  // Read one by ID - barcha userlar ko'ra oladi
  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const car = await Car.findById(id)
        .populate("category_info", "title imgUrl")
        .populate("addedBy", "username email firstName lastName phoneNumber");

      if (!car) {
        throw CustomErrorHandler.NotFound("Mashina topilmadi");
      }

      res.status(200).json({
        message: "Mashina topildi",
        data: car,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update - faqat admin
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { category_info, mator, tanirovka, year, color, distance, gearbook, price, description } = req.body;

      const car = await Car.findById(id);

      if (!car) {
        // Agar yangi rasmlar yuklangan bo'lsa, ularni o'chirish
        if (req.files && req.files.length > 0) {
          req.files.forEach((file) => {
            const filePath = path.join(__dirname, "../upload/images", file.filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });
        }
        throw CustomErrorHandler.NotFound("Mashina topilmadi");
      }

      // Agar category_info o'zgartirilayotgan bo'lsa, yangi category mavjudligini tekshirish
      if (category_info && category_info !== car.category_info.toString()) {
        const category = await Category.findById(category_info);
        if (!category) {
          // Agar yangi rasmlar yuklangan bo'lsa, ularni o'chirish
          if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
              const filePath = path.join(__dirname, "../upload/images", file.filename);
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            });
          }
          throw CustomErrorHandler.NotFound("Category topilmadi");
        }
        car.category_info = category_info;
      }

      // Agar yangi rasmlar yuklangan bo'lsa
      if (req.files && req.files.length > 0) {
        // Eski rasmlarni o'chirish
        car.imgUrl.forEach((imgUrl) => {
          const oldImagePath = path.join(__dirname, "..", imgUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        });

        // Yangi rasmlar URL'larini yaratish
        car.imgUrl = req.files.map((file) => `/images/${file.filename}`);
      }

      // Qolgan maydonlarni yangilash
      if (mator) car.mator = mator;
      if (tanirovka !== undefined) car.tanirovka = tanirovka === "true" || tanirovka === true;
      if (year) car.year = year;
      if (color) car.color = color;
      if (distance !== undefined) car.distance = distance;
      if (gearbook) car.gearbook = gearbook;
      if (price !== undefined) car.price = price;
      if (description) car.description = description;

      await car.save();

      infoLogger.info("Car updated", {
        carId: car._id,
        updatedBy: req.user._id,
        username: req.user.username,
      });

      res.status(200).json({
        message: "Mashina muvaffaqiyatli yangilandi",
        data: car,
      });
    } catch (error) {
      // Agar xatolik bo'lsa va yangi rasmlar yuklangan bo'lsa, ularni o'chirish
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          const filePath = path.join(__dirname, "../upload/images", file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      next(error);
    }
  },

  // Delete - faqat admin
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const car = await Car.findById(id);

      if (!car) {
        throw CustomErrorHandler.NotFound("Mashina topilmadi");
      }

      // Rasmlarni o'chirish
      car.imgUrl.forEach((imgUrl) => {
        const imagePath = path.join(__dirname, "..", imgUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });

      // Mashinani o'chirish
      await Car.findByIdAndDelete(id);

      infoLogger.info("Car deleted", {
        carId: id,
        deletedBy: req.user._id,
        username: req.user.username,
      });

      res.status(200).json({
        message: "Mashina muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = carController;
