const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController.js');
const {isUser} = require('../middlewares/isAuthenticated');
const reviewMiddleware = require("../middlewares/reviewMiddlewares.js");

router.post('/store/:id', isUser, reviewMiddleware.postValidator, reviewController.store);
router.get('/:id', reviewController.getReviewsForPaging);

module.exports = router;