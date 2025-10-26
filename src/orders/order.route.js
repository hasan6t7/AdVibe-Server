const express = require("express");
const { makePaymentReq } = require("./order.controller");
const router = express.Router();

// create checkout
router.post("/create-checkout-session", makePaymentReq)

module.exports = router;
