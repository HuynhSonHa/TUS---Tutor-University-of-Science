const express = require("express");
const router = express.Router();

const siteController = require("../controllers/SiteController");

router.get("/search", siteController.search);
router.get("/test", (req, res, next) => {
    res.render("index", {layout: 'admin'});
    //res.render();
})
router.get("/", siteController.getHomePage);

module.exports = router;
