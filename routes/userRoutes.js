const express = require("express");
const {
  loginController,
  registerController,
  forgotPassword,
} = require("../controller/userCtrl");

//router onject
const router = express.Router();

//routes

//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//FORGOT-PASSWORD
router.post("/forgot-password", forgotPassword);

module.exports = router;
