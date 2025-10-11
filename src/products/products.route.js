const express = require("express");
const { createNewProduct, getAllProducts, getSingleProducts } = require("./products.controller");
const router = express.Router();


// create a product or post a product
router.post("/create-product" , createNewProduct)

// get all products 
router.get("/" , getAllProducts)

// get single product 
router.get("/:id" , getSingleProducts)

module.exports = router;
