const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    products: [
      {
        productId: { type: String, required: true },
        name: { type: String },
        image: { type: String },
        quantity: { type: Number, required: true },
      },
    ],
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Completed" , "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
