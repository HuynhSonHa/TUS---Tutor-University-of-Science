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



// router.get("/admin/home-page", passport.authenticate('jwt', { session: false }), checkAdmin, adminController.getHomePage);
// router.get("/admin/product/:productId", passport.authenticate('jwt', { session: false }), checkAdmin, adminControllers.getProductDetail)

// router.get("/admin/product", passport.authenticate('jwt', { session: false }), checkAdmin, adminControllers.getFormCreateNewProduct)
// router.post("/admin/product", passport.authenticate('jwt', { session: false }), checkAdmin, UploadProduct, adminControllers.postANewProduct)

// router.get("/admin/productlist", passport.authenticate('jwt', { session: false }), checkAdmin, adminControllers.getProductList)
// router.get("/admin/dashboard", passport.authenticate('jwt', { session: false }), checkAdmin, adminControllers.getDashBoard)

router.get("/waitingTutor/:id", adminController.getDetailTutor);
router.get("/waitingTutor", adminController.getWaitingListTutor);
router.get("/accepted/:id", adminController.acceptTutor);
router.get("/denied/:id", adminController.denyTutor);

router.get("/account/edit/:id", adminController.getEditUserPage);
router.put("/account/edit/:id", adminController.putEditUserPage);
router.delete("/account/:id", adminController.destroyUser);
router.get("/account", adminController.getAccountPage);

router.get("product/edit/:id", adminController.getEditCoursePage);
router.put("product/edit/:id", adminController.putEditCoursePage);
router.delete("product/:id", adminController.destroyCourse);
router.get("/product", adminController.getCoursePage);
module.exports = router;
