const Products = require("../products/products.model");
const { errorResponse, successResponse } = require("../utils/responseHandler");
const Reviews = require("./review.model");

const createNewReview = async (req, res) => {
  const { comment, rating, userId, productId } = req.body;
  try {
    if (!comment || rating === undefined || !userId || !productId) {
      return errorResponse(res, 400, "Missing Required Field");
    }
    const existingReview = await Reviews.findOne({ productId, userId });
    if (existingReview) {
      existingReview.comment = comment;
      existingReview.rating = rating;
      await existingReview.save();
    } else {
      const newReview = new Reviews({ comment, rating, userId, productId });
      await newReview.save();
    }

    const reviews = await Reviews.find({ productId });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      const product = await Products.findById(productId);
      if (product) {
        product.rating = averageRating;
        await product.save({ validateBeforeSave: false });
      } else {
        return errorResponse(res, 404, "Product not Found!");
      }
    }
    return successResponse(res, 200, "Review Created Successfully!", reviews);
  } catch (error) {
    errorResponse(res, 500, "Create Review Failed");
  }
};

module.exports = {
  createNewReview,
};
