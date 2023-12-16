const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController.js');
const {isUser} = require('../middlewares/isAuthenticated');

router.post('/store/:id', isUser, orderController.store);

module.exports = router;