const express = require("express");
const { createNewProduct, getAllProducts } = require("./products.controller");
const router = express.Router();


// create a product or post a product
router.post("/create-product" , createNewProduct)

// get all products 
router.get("/" , getAllProducts)



module.exports = router;
