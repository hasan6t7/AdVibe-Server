const Reviews = require("../review/review.model");
const { errorResponse, successResponse } = require("../utils/responseHandler");
const Products = require("./products.model");

const createNewProduct = async (req, res) => {
  try {
    const newProducts = new Products({ ...req.body });
    const savedProduct = newProducts.save();

    const review = await Reviews.find({ productId: savedProduct._id });
    if (review.length > 0) {
      const totalRating = review.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const avaregeRating = totalRating / review.length;
      savedProduct.rating = avaregeRating;
      await savedProduct.save();
    }

    return successResponse(
      res,
      201,
      "Product Created Successfully!",
      savedProduct
    );
  } catch (error) {
    errorResponse(res, 500, "Product Create Failed", error);
  }
};

const getAllProducts = async (req, res) => {
  const {
    category,
    color,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    const filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (color && color !== "all") {
      filter.color = color;
    }
    if (minPrice && maxPrice) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && !isNaN(max)) {
        filter.price = { $gte: min, $lte: max };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalProduct = await Products.countDocuments(filter);
    const totalPage = Math.ceil(totalProduct / parseInt(limit));

    const products = await Products.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("author", "email");
    return successResponse(
      res,
      200,
      "Successfully get all products",
      (data = {
        products,
        totalPage,
        totalProduct,
      })
    );
  } catch (error) {
    errorResponse(res, 500, "Failed to get all products", error);
  }
};

module.exports = {
  createNewProduct,
  getAllProducts,
};
