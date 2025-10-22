const { Schema, model } = require("mongoose");

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    imgUrl: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Cascade delete: O'chirilganda tegishli mashinalarni ham o'chirish
CategorySchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    const Car = require("./car.schema");
    await Car.deleteMany({ category_info: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = model("Category", CategorySchema);
