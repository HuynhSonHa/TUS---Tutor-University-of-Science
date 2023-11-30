const express = require("express");
const router = express.Router();

const {getSignIn,getSignUp,postSignIn,postSignUp,getHomePage} = require("../controllers/AuthController");

router.get("/signin", getSignIn);
router.get("/signup", getSignUp);
router.get("/register", getSignUp);
router.post("/signin", postSignIn);
router.post("/signup", postSignUp);
router.post("/register", postSignUp);
//router.get("/forget-password", authController.forgetpassword);
router.get("/", getHomePage);


module.exports = router;
