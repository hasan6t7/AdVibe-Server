const express = require("express");
const { errorResponse, successResponse } = require("../utils/responseHandler");
const User = require("../users/user.model");
const Order = require("../orders/order.model");
const Reviews = require("../review/review.model");
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

module.exports = router;
