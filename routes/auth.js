const express = require("express");
const multer = require('multer');
const router = express.Router();
const storage = require('../config/multer');

const {getSignIn,getSignUp,postSignIn,postSignUp,getHomePage,getForgetPassword,getResetPassword} = require("../controllers/AuthController");
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
router.get("/reset-password", getResetPassword);
router.get("/", getHomePage);


module.exports = router;
