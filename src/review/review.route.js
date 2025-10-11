const express = require("express");
const { createNewReview } = require("./review.controller");
const router = express.Router();

// Create Review 
router.post("/create-review" , createNewReview)

module.exports = router 