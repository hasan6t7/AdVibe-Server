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
    return successResponse(res, 200, "Successfully get all products", {
      products,
      totalPage,
      totalProduct,
    });
  } catch (error) {
    errorResponse(res, 500, "Failed to get all products", error);
  }
};

const getSingleProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const singleProduct = await Products.findById(id).populate(
      "author",
      "email username"
    );
    if (!singleProduct) {
      return errorResponse(res, 404, "product not found!");
    }

    const review = await Reviews.find({ productId: id }).populate(
      "userId",
      "username email"
    );

    return successResponse(
      res,
      200,
      "get single product and review successfully",
      { singleProduct, review }
    );
  } catch (error) {
    errorResponse(res, 500, "Failed to get single product", error);
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedDoc = req.body;

  try {
    const updatedProduct = await Products.findByIdAndUpdate(id, updatedDoc, {
      new: true,
    });
    if (!updatedProduct) {
      return errorResponse(res, 404, "Product Not Found");
    }
    return successResponse(
      res,
      200,
      "Product Updated Successfully!",
      updatedProduct
    );
  } catch (error) {
    errorResponse(res, 500, "Failed to update product", error);
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const deleted = await Products.findByIdAndDelete(productId);
    if (!deleted) {
      errorResponse(res, 404, "Product Not Found");
    }
    await Reviews.deleteMany(productId);
    successResponse(res, 200, "Product Deleted Successfully!");
  } catch (error) {
    errorResponse(res, 500, "Delete Product Failed", error);
  }
};

module.exports = {
  createNewProduct,
  getAllProducts,
  getSingleProducts,
  updateProduct,
  deleteProduct,
};
