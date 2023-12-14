const express = require("express");
const multer = require('multer');
const router = express.Router();
const storage = require('../config/multer');

const authController = require("../controllers/AuthController");
const upload = multer({ storage: storage });

router.get("/signin", authController.getSignIn);
router.get("/login", authController.getSignIn);
router.get("/signup", authController.getSignUp);
router.get("/register", authController.getSignUp);
router.post("/signin", authController.postSignIn);
router.post("/login", authController.postSignIn);
router.post("/signup",upload.single('avatar'), authController.postSignUp);
router.post("/register",upload.single('avatar'), authController.postSignUp);
router.get("/forget-password", authController.getForgetPassword);
router.post("/forget-password", authController.postForgetPassword);
router.get("/reset-password", authController.getResetPassword);
router.post("/reset-password", authController.postResetPassword);
router.get("/logout", authController.Logout);
router.get("/", authController.getHomePage);


module.exports = router;
