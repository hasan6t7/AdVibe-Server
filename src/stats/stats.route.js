const express = require("express");
const { errorResponse, successResponse } = require("../utils/responseHandler");
const User = require("../users/user.model");
const Order = require("../orders/order.model");
const Reviews = require("../review/review.model");
const Products = require("../products/products.model");
const router = express.Router();

// user stats
router.get("/user-stats/:email", async (req, res) => {
  const { email } = req.params;
  if (!email) return errorResponse(res, 400, "Email is Required");

  try {
    const user = await User.findOne({ email: email });
    if (!user) return errorResponse(res, 404, "User Not Found");

    // total pay
    const totalPaymentResult = await Order.aggregate([
      { $match: { email: email } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const totalPaymentAmount =
      totalPaymentResult.length > 0 ? totalPaymentResult[0].totalAmount : 0;

    const totalReviews = await Reviews.countDocuments({ userId: user._id });

    const purchacedProductsId = await Order.distinct("products.productId", {
      email: email,
    });
    const totalPurchasedProduct = purchacedProductsId.length;
    return successResponse(res, 200, "User Stats get successfully", {
      totalPayment: parseFloat(totalPaymentAmount.toFixed(2)),
      totalReviews,
      totalPurchasedProduct,
    });
  } catch (error) {
    errorResponse(res, 500, "Failed to get User Stats", error);
  }
});

// admin stats
router.get("/admin-stats", async (req, res) => {
  // total order
  const totalOrders = await Order.countDocuments();

  //   total Products
  const totalProducts = await Products.countDocuments();

  //   total reviews
  const totalReviews = await Reviews.countDocuments();

  //   total user
  const totalUser = await User.countDocuments();

  //   total earning
  const totalEarningsResult = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$amount" },
      },
    },
  ]);
  const totalEarnings =
    totalEarningsResult.length > 0 ? totalEarningsResult[0].totalEarnings : 0;

  // monthly earning

  const monthlyEarningsResult = await Order.aggregate([
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        monthlyEarnings: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);
  const monthlyEarnings = monthlyEarningsResult.map((entry) => ({
    month: entry._id.month,
    year: entry._id.year,
    earnings: entry.monthlyEarnings,
  }));
  res.status(200).json({
    totalOrders,
    totalProducts,
    totalReviews,
    totalUser,
    totalEarnings,
    monthlyEarnings,
  });
});

module.exports = router;
