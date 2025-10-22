const { Schema, model } = require("mongoose");

const CarSchema = new Schema(
  {
    category_info: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    mator: {
      type: String,
      required: true,
      trim: true,
    },
    tanirovka: {
      type: Boolean,
      default: false,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    color: {
      type: String,
      enum: ["qora", "oq", "kulrang", "qizil", "ko'k", "yashil", "sariq", "jigarrang", "pushti", "binafsha", "boshqa"],
      required: true,
    },
    distance: {
      type: Number,
      required: true,
      min: 0,
    },
    gearbook: {
      type: String,
      enum: ["mexanika", "avtomat", "robot", "variator"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imgUrl: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0 && v.length <= 10;
        },
        message: "Kamida 1 ta va ko'pi bilan 10 ta rasm yuklash mumkin",
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
      maxLength: 2000,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("Car", CarSchema);
