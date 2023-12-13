const express = require("express");
const router = express.Router();

const siteController = require("../controllers/SiteController");

router.get("/search", siteController.search);
<<<<<<< Updated upstream
router.get("/", siteController.getHomePage);
=======
router.get("/", siteController.index);
>>>>>>> Stashed changes

module.exports = router;
