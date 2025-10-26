const mongoose = require("mongoose");

const reviwSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      require: true,
    },
    rating: {
      type: Number, 
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reviews = mongoose.model("Review", reviwSchema);

module.exports = Reviews;
