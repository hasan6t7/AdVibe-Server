const express = require("express");
const {
  userRegistration,
  userLoggedIn,
  userLoggedOut,
  getAllUsers,
  userDelete,
  userUpadate,
  userProfileUpdate,
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

// delete user
router.delete("/users/:id", verifyToken, verifyAdmin, userDelete);

// edit user role

router.put("/users/:id",verifyToken, verifyAdmin, userUpadate);

// user profile edit

router.patch("/edit-profile/:id",verifyToken, userProfileUpdate);

module.exports = router;
