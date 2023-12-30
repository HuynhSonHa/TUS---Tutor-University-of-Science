const express = require("express");
const multer = require('multer');
const router = express.Router();
const storage = require('../config/multer');

const authController = require("../controllers/AuthController");
const authMiddlewares = require("../middlewares/authMiddlewares");
const upload = multer({ storage: storage });

router.get("/signin", authController.getSignIn);
router.get("/login", authController.getSignIn);
router.get("/signup", authController.getSignUp);
router.get("/register", authController.getSignUp);
router.post("/signin", authMiddlewares.signinValidator, authController.postSignIn);
router.post("/login", authMiddlewares.signinValidator,authController.postSignIn);
router.post("/signup",authMiddlewares.signupValidator, authController.postSignUp);
router.post("/register",authMiddlewares.signupValidator, authController.postSignUp);
router.get("/forget-password", authController.getForgetPassword);
router.post("/forget-password", authMiddlewares.forgetValidator, authController.postForgetPassword);
router.get("/reset-password", authController.getResetPassword);
router.post("/reset-password", authMiddlewares.resetValidator, authController.postResetPassword);
router.get("/logout", authController.Logout);
router.get("/", authController.getHomePage);


module.exports = router;
