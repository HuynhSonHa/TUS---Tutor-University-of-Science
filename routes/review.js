const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController.js');
const {isUser} = require('../middlewares/isAuthenticated');

router.post('/store/:id', isUser, reviewController.store);

module.exports = router;