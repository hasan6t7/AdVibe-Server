const express = require("express");
const { createNewReview, getReviewUser } = require("./review.controller");
const router = express.Router();

// Create Review 
router.post("/create-review" , createNewReview)

// get review 
router.get("/:id" , getReviewUser)

module.exports = router 