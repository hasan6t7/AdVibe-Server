const express = require("express");
const { createNewReview, getReviewUser, getTotalReviewsCount } = require("./review.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

// Create Review 
router.post("/create-review" , createNewReview)

// total review count 
router.get("/total-reviews" , getTotalReviewsCount)


// get review 
router.get("/:id" , getReviewUser)


module.exports = router 