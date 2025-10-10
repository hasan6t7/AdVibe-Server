const express = require("express");
const { userRegistration, userLoggedIn, userLoggedOut, getAllUsers } = require("./user.controller");
const router = express.Router();


// Registration 
router.post("/register", userRegistration);

// Login 
router.post("/login" , userLoggedIn)

// logout 
router.post("/logout" , userLoggedOut)

// all user 
router.get("/users" , getAllUsers)

module.exports = router;
