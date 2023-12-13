const express = require("express");
const multer = require('multer');
const router = express.Router();
const storage = require('../config/multer');

const {getSignIn,getSignUp,postSignIn,postSignUp,getHomePage,getForgetPassword,postForgetPassword,getResetPassword,postResetPassword,Logout} = require("../controllers/AuthController");
const upload = multer({ storage: storage });

router.get("/signin", getSignIn);
router.get("/login", getSignIn);
router.get("/signup", getSignUp);
router.get("/register", getSignUp);
router.post("/signin", postSignIn);
router.post("/login", postSignIn);
router.post("/signup",upload.single('avatar'), postSignUp);
router.post("/register",upload.single('avatar'), postSignUp);
router.get("/forget-password", getForgetPassword);
router.post("/forget-password", postForgetPassword);
router.get("/reset-password", getResetPassword);
router.post("/reset-password", postResetPassword);
router.get("/logout", Logout);
router.get("/", getHomePage);


module.exports = router;
