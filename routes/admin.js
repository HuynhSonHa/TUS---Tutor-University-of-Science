const express = require("express")
const router = express.Router();
const passport = require("passport");
//require("../middlewares/passportAccessToken.js");

//const checkAdmin = require("../middlewares/authenticationAdmin.js")
const adminController = require("../controllers/AdminController.js");


// const multerConfig = require("../config/multer.js")
// const multer = require("multer");


// const upload = multerConfig;

// const UploadProduct = upload.fields([
//     { name: 'thumbnail', maxCount: 1 },
//     { name: 'gallery', maxCount: 8 },
// ]);



// router.get("/admin/home-page", passport.authenticate('jwt', { session: false }), checkAdmin, adminControllers.getHomePage);
// router.get("/admin/product/:productId", passport.authenticate('jwt', { session: false }), checkAdmin, adminControllers.getProductDetail)

// router.get("/admin/product", passport.authenticate('jwt', { session: false }), checkAdmin, adminControllers.getFormCreateNewProduct)
// router.post("/admin/product", passport.authenticate('jwt', { session: false }), checkAdmin, UploadProduct, adminControllers.postANewProduct)

// router.get("/admin/productlist", passport.authenticate('jwt', { session: false }), checkAdmin, adminControllers.getProductList)
// router.get("/admin/dashboard", passport.authenticate('jwt', { session: false }), checkAdmin, adminControllers.getDashBoard)

router.get("/waitingTutor/:id", adminController.getDetailTutor);
router.get("/waitingTutor", adminController.getWaitingListTutor);

router.get("/accepted/:id", adminController.acceptTutor);
router.get("/denied/:id", adminController.denyTutor);
module.exports = router;
