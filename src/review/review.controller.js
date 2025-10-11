const mongoose = require("mongoose");

const productSchima = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: String,
    description: String,
    price: {
      require: true,
    },
    oldPrice: Number,
    image: {
      type: String,
      require: true,
    },
    color: String,
    rating: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const products = mongoose.model("Products", productSchima);

module.exports = products;
