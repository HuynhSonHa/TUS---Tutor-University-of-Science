const express = require("express");
<<<<<<< Updated upstream
const multer = require('multer');
const router = express.Router();
const storage = require('../config/multer');

const {getSignIn,getSignUp,postSignIn,postSignUp,getHomePage} = require("../controllers/AuthController");
const upload = multer({ storage: storage });

router.get("/signin", getSignIn);
router.get("/login", getSignIn);
router.get("/signup", getSignUp);
router.get("/register", getSignUp);
router.post("/signin", postSignIn);
router.post("/login", postSignIn);
router.post("/signup",upload.single('avatar'), postSignUp);
router.post("/register",upload.single('avatar'), postSignUp);
//router.get("/forget-password", authController.forgetpassword);
router.get("/", getHomePage);
=======
const router = express.Router();

const loginController = require("../controllers/AuthController");


router.get("/signin", loginController.getSignIn);
router.get("/signup", loginController.getSignUp);
router.post("/signin", loginController.postSignIn);
router.post("/signup", loginController.postSignUp);
//router.get("/register", loginController.register);
//router.get("/forget-password", loginController.forgetpassword);
router.get("/", loginController.index);
>>>>>>> Stashed changes


module.exports = router;
