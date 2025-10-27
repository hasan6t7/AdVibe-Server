const express = require("express");
const {
  makePaymentReq,
  confirmPayment,
  getOrdersByEmail,
  getOrdersByOrderId,
  getAllOrder,
} = require("./order.controller");
const router = express.Router();

// create checkout
router.post("/create-checkout-session", makePaymentReq);

// confirm payment
router.post("/confirm-payment", confirmPayment);

// get orders by email
router.get("/:email", getOrdersByEmail);

// get orders by orderID
router.get("/order/:id", getOrdersByOrderId);

// get all orders ( admin only)
router.get("/" , getAllOrder)

module.exports = router;
