const express = require("express");
const {
  userRegistration,
  userLoggedIn,
  userLoggedOut,
  getAllUsers,
} = require("./user.controller");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();

// Registration
router.post("/register", userRegistration);

// Login
router.post("/login", userLoggedIn);

// logout
router.post("/logout", userLoggedOut);

// all user
router.get("/users", verifyToken, verifyAdmin, getAllUsers);

module.exports = router;
