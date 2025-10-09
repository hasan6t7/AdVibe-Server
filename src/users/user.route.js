const express = require("express");
const { userRegistration, userLoggedIn } = require("./user.controller");
const router = express.Router();


// Registration 
router.post("/register", userRegistration);

// Login 
router.post("/login" , userLoggedIn)

module.exports = router;
