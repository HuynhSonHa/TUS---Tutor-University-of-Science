const express = require("express");
const router = express.Router();

const loginController = require("../app/controllers/LoginController");


router.get("/signin", loginController.getSignIn);
router.get("/signup", loginController.getSignUp);
router.post("/signin", loginController.postSignIn);
router.post("/signup", loginController.postSignUp);
//router.get("/register", loginController.register);
//router.get("/forget-password", loginController.forgetpassword);
router.get("/", loginController.index);


module.exports = router;
