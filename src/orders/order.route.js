const express = require("express");
const { makePaymentReq, confirmPayment, getOrdersByEmail } = require("./order.controller");
const router = express.Router();

// create checkout
router.post("/create-checkout-session", makePaymentReq);

// confirm payment
router.post("/confirm-payment", confirmPayment);


// get orders by email 
router.get("/:email" , getOrdersByEmail)

module.exports = router;
