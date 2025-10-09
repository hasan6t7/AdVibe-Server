const express = require("express");
const { userRegistration } = require("./user.controller");
const router = express.Router();

router.post("/register", userRegistration);

module.exports = router;
