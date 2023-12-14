const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController.js');
const {isAuthenticated} = require('../middlewares/isAuthenticated');

router.post('/store/:id', isAuthenticated, orderController.store);

module.exports = router;