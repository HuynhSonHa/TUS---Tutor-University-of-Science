const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController.js');
const {isAuthenticated} = require('../middlewares/isAuthenticated');

router.post('/store/:id', isAuthenticated, reviewController.store);

module.exports = router;